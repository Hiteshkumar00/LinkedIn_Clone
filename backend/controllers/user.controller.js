import User from '../models/user.model.js';
import Profile from '../models/profile.model.js';
import ConnectionRequest from '../models/connections.model.js';

import bcrypt from 'bcrypt';
import crypto from 'crypto';

import PDFDocument from 'pdfkit';
import fs from 'fs';
import { equal } from 'assert';

// function uses in constructor


const convertUserDataToPDF = async (profile) => {
  const doc = new PDFDocument();
  const outputPath = crypto.randomBytes(16).toString('hex') + '.pdf';
  const stream = fs.createWriteStream("uploads/" + outputPath);

  doc.pipe(stream);

  // Add Profile Picture
  doc.image(`uploads/${ profile.userId.profilePicture}`, { align: "center", height: 80 });
  doc.moveDown(4);

  // Profile Info Header
  doc.fontSize(18).font('Helvetica-Bold').text("Profile Information", { align: "center" });
  doc.moveDown(1); 

  // Name, Username, Email
  doc.fontSize(14).font('Helvetica').text("Name: " + profile.userId.name);
  doc.fontSize(14).text("Username: " + profile.userId.username);
  doc.fontSize(14).text("Email: " + profile.userId.email);

  // Bio
  doc.moveDown(0.5); 
  doc.fontSize(14).text("Bio: " + profile.bio);

  // Current Position
  doc.moveDown(0.5); 
  doc.fontSize(14).text("Current Position: " + profile.currentPost);

  // Past Work Section
  doc.moveDown(1);
  doc.fontSize(16).font('Helvetica-Bold').text("Past Work", { underline: true });
  doc.moveDown(0.5);

  profile.pastWork.forEach((work) => {
    doc.fontSize(14).text(`Company: ${work.company}`);
    doc.fontSize(14).text(`Position: ${work.position}`);
    doc.fontSize(14).text(`Years: ${work.years}`);
    doc.moveDown(0.5); 
  });

  // Education Section
  doc.moveDown(1);
  doc.fontSize(16).font('Helvetica-Bold').text("Education", { underline: true });
  doc.moveDown(0.5);

  profile.education.forEach((edu) => {
    doc.fontSize(14).text(`School: ${edu.school}`);
    doc.fontSize(14).text(`Degree: ${edu.degree}`);
    doc.fontSize(14).text(`Field of Study: ${edu.fieldOfStudy}`);
    doc.moveDown(0.5); 
  });

  // Finish the PDF
  doc.end();

  return outputPath;
};


// user constructors

const register = async (req, res, next) => {
  const {name, username, email, password } = req.body;
  if(!name || !username ||!email || !password){
    return res.status(400).json({message: 'All fields are required.'});
  };
  const existingUser = await User.findOne({username});
  const existingEmail = await User.findOne({email});
  if(existingUser || existingEmail) {
    return res.status(400).json({message: 'Username already exists.'});
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({name, username, email, password: hashedPassword});
  const savedUser = await newUser.save();

  const newProfile = new Profile({userId: savedUser._id});
  const savedProfile =  newProfile.save();
  
  return res.status(201).json({message: `${savedUser.username} has been registered successfully.`});
};

const login = async (req, res, next) => {
  const {username, password} = req.body;
  if(!username || !password) {
    return res.status(400).json({message: 'All fields are required.'});
  };

  const user = await User.findOne({username});
  if(!user) {
    return res.status(404).json({message: 'User not found.'});
  };
  
  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch){
    return res.status(400).json({message: 'Invalid credentials.'});
  };

  const token = crypto.randomBytes(32).toString('hex');
  await User.updateOne({_id: user._id}, {token});

  return res.status(200).json({message: 'Login successful.', token});
};


const uploadProfilePicture = async (req, res, next) => {
  const {token} = req.body;
  const {file} = req;
  console.log(file);
  if(!token || !file) {
    return res.status(400).json({message: 'Invalid request.'});
  };

  const user = await User.findOne({token});
  if(!user) {
    return res.status(404).json({message: 'User not found.'});
  };
  user.profilePicture = file.filename;
  await user.save();

  return res.status(200).json({message: 'Profile picture updated.'});
};

const updateUser = async (req, res, next) => {
  const {token, ...newUserData} = req.body;
  const user = await User.findOne({token});
  if(!user) {
    return res.status(404).json({message: 'User not found.'});
  };

  const {username, email} = newUserData;
  
  const existingUser = await User.findOne({$or: {username, email}});
  if(existingUser && String(existingUser._id) !== String(user._id)) {
    return res.status(400).json({message: 'Username or email already exists.'});
  };

  Object.assign(user, newUserData);
  await user.save();

  return res.status(200).json({message: 'Profile updated!.'});
};

const getUserAndProfile = async (req, res, next) => {
  const {token} = req.query;
  if(!token) {
    return res.status(400).json({message: 'Invalid request.'});
  };
  const user = await User.findOne({token});
  if(!user) {
    return res.status(404).json({message: 'User not found.'});
  };
  const profile = await Profile.findOne({userId: user._id})
    .populate('userId', 'name username email profilePicture');

  res.status(200).json(profile);
};

const updateProfileData = async (req, res, next) => {
  const {token, ...profileData} = req.body;
  if(!token) {
    return res.status(400).json({message: 'Invalid request.'});
  };

  const user = await User.findOne({token});
  if(!user) {
    return res.status(404).json({message: 'User not found.'});
  };

  const profile = await Profile.findOne({userId: user._id});

  Object.assign(profile, profileData);
  await profile.save();

  return res.status(200).json({message: 'Profile updated!'});
};

const getAllUserProfile = async (req, res, next) => {
  const AllUsers = await Profile.find({}).populate('userId', 'name username email profilePicture');

  res.status(200).json(AllUsers);
};

const downloadResume = async (req, res, next) => {
  const userId = req.query.id;
  const user = await User.findById(userId);
  if(!user) {
    return res.status(404).json({message: 'User not found.'});
  };
  const profile = await Profile.findOne({userId: user._id})
    .populate('userId', 'name username email profilePicture');

  const outputPath = await convertUserDataToPDF(profile);

  res.status(200).json({message: outputPath});
};


const sendConnectionRequest = async (req, res, next) => {
  const {token, connectionId} = req.body;
  if(!token || !connectionId) {
    return res.status(400).json({message: 'Invalid request.'});
  };
  const user = await User.findOne({token});
  if(!user) {
    return res.status(404).json({message: 'User not found.'});
  };

  const connectionUser = await User.findById(connectionId);
  if(!connectionUser) {
    return res.status(404).json({message: 'Connection user not found.'});
  };

  const connection = await ConnectionRequest.findOne({userId: user._id, connectionId});
  if(connection) {
    return res.status(400).json({message: 'Connection request already sent.'});
  };

  if(user._id.toString() === connectionId) {
    return res.status(400).json({message: 'You cannot connect with yourself.'});
  };

  const newConnection = new ConnectionRequest({userId: user._id, connectionId});
  await newConnection.save();

  return res.status(200).json({message: 'Connection request sent.'});
};

const getMyConnectionsRequest = async (req, res, next) => {
  const {token} = req.query;
  if(!token) {
    return res.status(400).json({message: 'Invalid request.'});
  };

  const user = await User.findOne({token});
  if(!user) {
    return res.status(404).json({message: 'User not found.'});
  };

  const connections = await ConnectionRequest.find({userId: user._id})
    .populate('connectionId', 'name username email profilePicture');

  return res.status(200).json(connections);
};

const whatAreMyConnections = async (req, res, next) => {
  const {token} = req.body;
  if(!token) {
    return res.status(400).json({message: 'Invalid request.'});
  };

  const user = await User.findOne({token});
  if(!user) {
    return res.status(404).json({message: 'User not found.'});
  };

  const connections = await ConnectionRequest.find({connectionId: user._id})
  .populate('userId', 'name username email profilePicture');

  return res.status(200).json(connections);
};

const acceptConnectionRequest = async (req, res, next) => {
  const {token, reqId, action_type} = req.body;
  if(!token || !reqId) {
    return res.status(400).json({message: 'Invalid request.'});
  };

  const user = await User.findOne({token});
  if(!user) {
    return res.status(404).json({message: 'User not found.'});
  };

  const connection = await ConnectionRequest.findById(reqId);

  if(!connection) {
    return res.status(404).json({message: 'Connection request not found.'});
  };

  if(action_type === 'accept') {
    connection.status_accepted = true;
  }
  else {
    connection.status_accepted = false;
  }

  await connection.save();

  return res.status(200).json({message: 'Connection request updated.'});
};


const getUserByUsername = async (req, res, next) => {
  const {username} = req.query;

  if(!username) return res.status(400).json({message: 'username not provided'});

  const user = await User.findOne({username});

  if(!user) return res.status(404).json({message: "user not found with this username"});

  const userProfile = await Profile.findOne({userId: user._id})
     .populate('userId', 'name username email profilePicture');

  return res.status(200).json(userProfile);
};



export {
  register, 
  login, 
  uploadProfilePicture, 
  updateUser, 
  getUserAndProfile,
  updateProfileData,
  getAllUserProfile,
  downloadResume,
  sendConnectionRequest,
  getMyConnectionsRequest,
  acceptConnectionRequest,
  whatAreMyConnections,
  getUserByUsername
};