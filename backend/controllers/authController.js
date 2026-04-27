import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { OAuth2Client } from 'google-auth-library';

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const authUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            generateToken(res, user._id);

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        generateToken(res, user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const count = await User.countDocuments();
    const users = await User.find({}).skip(skip).limit(limit).sort({ createdAt: -1 });

    res.json({ users, page, pages: Math.ceil(count / limit), total: count });
};

// @desc    Delete user
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            if (user.email === req.user.email) {
                return res.status(400).json({ message: 'Cannot delete yourself' });
            }
            await User.deleteOne({ _id: user._id });
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user (Toggle Admin)
// @route   PUT /api/auth/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            if (user.email === req.user.email) {
                 return res.status(400).json({ message: 'Cannot demote yourself' });
            }
            user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user via Google
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: 'Google token is required' });
        }

        const googleClientId = process.env.GOOGLE_CLIENT_ID;
        if (!googleClientId) {
            console.error('GOOGLE_CLIENT_ID is not set in environment variables');
            return res.status(500).json({ message: 'Google authentication is not configured on the server' });
        }

        // Verify token with Google's public endpoint (robust fallback method)
        let payload;
        try {
            // Method 1: Use google-auth-library
            const oauthClient = new OAuth2Client(googleClientId);
            const ticket = await oauthClient.verifyIdToken({
                idToken: token,
                audience: googleClientId,
            });
            payload = ticket.getPayload();
        } catch (verifyErr) {
            console.error('google-auth-library verifyIdToken failed:', verifyErr.message);
            // Method 2: Fallback to Google's tokeninfo endpoint
            try {
                const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
                const tokenInfo = await response.json();
                console.log('tokeninfo response:', JSON.stringify(tokenInfo));

                if (tokenInfo.error || tokenInfo.error_description) {
                    console.error('Google tokeninfo error:', tokenInfo.error_description || tokenInfo.error);
                    return res.status(401).json({ message: 'Invalid Google token. Please try signing in again.' });
                }

                // Validate audience
                if (tokenInfo.aud !== googleClientId) {
                    console.error('Token audience mismatch. Got:', tokenInfo.aud, 'Expected:', googleClientId);
                    return res.status(401).json({ message: 'Token audience mismatch.' });
                }

                payload = tokenInfo;
                payload.name = tokenInfo.name;
                payload.email = tokenInfo.email;
                payload.picture = tokenInfo.picture;
            } catch (fallbackErr) {
                console.error('Fallback tokeninfo also failed:', fallbackErr.message);
                return res.status(401).json({ message: 'Google token verification failed. Please try again.' });
            }
        }

        if (!payload || !payload.email) {
            return res.status(401).json({ message: 'Invalid Google token payload - no email found' });
        }

        const { name, email, picture } = payload;
        console.log('Google auth: Verified user email:', email);

        let user = await User.findOne({ email });

        if (!user) {
            console.log('Google auth: Creating new user for', email);
            user = await User.create({
                name: name || email.split('@')[0],
                email,
                // Random password for Google users — they'll never use it
                password: `google_${Date.now()}_${Math.random().toString(36)}`,
                isAdmin: false
            });
        } else {
            console.log('Google auth: Found existing user for', email);
        }

        generateToken(res, user._id);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            picture
        });

    } catch (error) {
        console.error('Google auth unhandled error:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Google sign-in failed: ' + error.message });
        }
    }
};

