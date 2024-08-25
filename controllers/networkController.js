const User = require('../models/User');
const UserRelationship = require('../models/userRelationship');

// Send Follow Request
exports.sendFollowRequest = async function(req, res) {
    try {
        const user = await User.findById(req.user.id);
        const targetUser = await User.findById(req.params.id);

        if (!targetUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        let userRelationship = await UserRelationship.findOne({ userId: user._id });
        if (!userRelationship) {
            userRelationship = new UserRelationship({ userId: user._id });
        }

        if (targetUser.isCreator) {
            if (!userRelationship.following.includes(targetUser._id)) {
                userRelationship.following.push(targetUser._id);
                await userRelationship.save();
            }
        } else {
            if (!userRelationship.following.includes(targetUser._id) && !userRelationship.followRequestsSent.includes(targetUser._id)) {
                userRelationship.followRequestsSent.push(targetUser._id);
                await userRelationship.save();

                let targetUserRelationship = await UserRelationship.findOne({ userId: targetUser._id });
                if (!targetUserRelationship) {
                    targetUserRelationship = new UserRelationship({ userId: targetUser._id });
                }
                targetUserRelationship.followRequestsReceived.push(user._id);
                await targetUserRelationship.save();
            }
        }

        res.status(200).json({ msg: 'Follow request sent or user followed if creator' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Accept Follow Request
exports.acceptFollowRequest = async function(req, res) {
    try {
        const user = await User.findById(req.user.id);
        const requestingUser = await User.findById(req.params.id);

        if (!requestingUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        let userRelationship = await UserRelationship.findOne({ userId: user._id });
        let requestingUserRelationship = await UserRelationship.findOne({ userId: requestingUser._id });

        if (!userRelationship || !requestingUserRelationship) {
            return res.status(404).json({ msg: 'Relationship data not found' });
        }

        if (userRelationship.followRequestsReceived.includes(requestingUser._id)) {
            userRelationship.followRequestsReceived.pull(requestingUser._id);
            userRelationship.followers.push(requestingUser._id);
            requestingUserRelationship.followRequestsSent.pull(user._id);
            requestingUserRelationship.following.push(user._id);

            await userRelationship.save();
            await requestingUserRelationship.save();
        } else {
            return res.status(400).json({ msg: 'Follow request not found' });
        }

        res.status(200).json({ msg: 'Follow request accepted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Decline Follow Request
exports.declineFollowRequest = async function(req, res) {
    try {
        const user = await User.findById(req.user.id);
        const requestingUser = await User.findById(req.params.id);

        if (!requestingUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        let userRelationship = await UserRelationship.findOne({ userId: user._id });
        let requestingUserRelationship = await UserRelationship.findOne({ userId: requestingUser._id });

        if (!userRelationship || !requestingUserRelationship) {
            return res.status(404).json({ msg: 'Relationship data not found' });
        }

        if (userRelationship.followRequestsReceived.includes(requestingUser._id)) {
            userRelationship.followRequestsReceived.pull(requestingUser._id);
            requestingUserRelationship.followRequestsSent.pull(user._id);

            await userRelationship.save();
            await requestingUserRelationship.save();
        } else {
            return res.status(400).json({ msg: 'Follow request not found' });
        }

        res.status(200).json({ msg: 'Follow request declined' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
};


// Unfollow User
exports.unfollowUser = async function(req, res) {
    try {
        const user = await User.findById(req.user.id);
        const targetUser = await User.findById(req.params.id);

        if (!targetUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        let userRelationship = await UserRelationship.findOne({ userId: user._id });
        let targetUserRelationship = await UserRelationship.findOne({ userId: targetUser._id });

        if (!userRelationship || !targetUserRelationship) {
            return res.status(404).json({ msg: 'Relationship data not found' });
        }

        // Remove the target user from the following list of the authenticated user
        if (userRelationship.following.includes(targetUser._id)) {
            userRelationship.following.pull(targetUser._id);
        }

        // Remove the authenticated user from the followers list of the target user
        if (targetUserRelationship.followers.includes(user._id)) {
            targetUserRelationship.followers.pull(user._id);
        }

        await userRelationship.save();
        await targetUserRelationship.save();

        res.status(200).json({ msg: 'User unfollowed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
};
