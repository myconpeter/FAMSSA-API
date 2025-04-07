import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
	{
		fullname: {
			type: String,
		},
		regno: {
			type: String,
		},
		email: {
			type: String,
		},
		isAdmin:{
			type: Boolean,
			default: false
		},
		password: {
			type: String,
		},
	},
	{ timestamps: true }
);

userSchema.pre('save', async function (next) {
	// Check if the password is being modified (or it's a new user)
	if (!this.isModified('password')) {
		return next(); // Skip hashing if the password is not modified
	}

	// Hash the password
	const salt = await bcrypt.genSalt(12);
	this.password = await bcrypt.hash(this.password, salt); // Hash password and store it

	next(); // Proceed to the next middleware or saving the document
});

userSchema.methods.matchPassword = async function (enteredPassword) {
	const comparePassword = await bcrypt.compare(enteredPassword, this.password);
	return comparePassword ? this.password : null;
};

const UserModel = mongoose.model('UserModel', userSchema);

export default UserModel;
