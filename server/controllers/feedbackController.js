const mongoose = require('mongoose');
const Feedback = require('../models/Feedback');
const Order = require('../models/Order');
const { isFallback, store } = require('../config/db');

const findOrderByIdentifier = async (identifier) => {
  const value = typeof identifier === 'string' ? identifier.trim() : '';
  if (!value) return null;

  if (isFallback()) {
    return store.orders.find((order) => order._id === value || order.orderId === value) || null;
  }

  const isValidObjectId = mongoose.isValidObjectId(value);
  const query = {
    $or: [
      ...(isValidObjectId ? [{ _id: value }] : []),
      { orderId: value }
    ]
  };

  return Order.findOne(query);
};

// @desc    Submit rating and feedback for a collected order
// @route   POST /api/feedback
// @access  Private (Student)
const submitFeedback = async (req, res) => {
  const { orderId, rating, comment } = req.body;
  const trimmedOrderId = typeof orderId === 'string' ? orderId.trim() : '';
  const trimmedComment = typeof comment === 'string' ? comment.trim() : '';
  const parsedRating = Number(rating);

  if (!trimmedOrderId) {
    return res.status(400).json({ success: false, message: 'Please provide a valid order ID' });
  }

  if (!trimmedComment && (!Number.isFinite(parsedRating) || parsedRating < 1 || parsedRating > 5)) {
    return res.status(200).json({ success: true, message: 'Feedback skipped. You can submit it later.' });
  }

  try {
    const order = await findOrderByIdentifier(trimmedOrderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const orderUserId = order.user && typeof order.user.toString === 'function' ? order.user.toString() : String(order.user);
    if (orderUserId !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only submit feedback for your own orders' });
    }

    if (order.orderStatus !== 'Collected') {
      return res.status(400).json({ success: false, message: 'Feedback can be submitted only after an order is collected' });
    }

    const hasValidFeedback = trimmedComment.length > 0 && Number.isFinite(parsedRating) && parsedRating >= 1 && parsedRating <= 5;
    if (!hasValidFeedback) {
      return res.status(200).json({ success: true, message: 'Feedback skipped. You can submit it later.' });
    }

    if (isFallback()) {
      const existingFb = store.feedbacks.find(f => f.orderId === order.orderId || f.order === order._id);
      if (existingFb) {
        return res.status(400).json({ success: false, message: 'Feedback has already been submitted for this order' });
      }

      const newFb = {
        _id: 'fb_' + Date.now(),
        user: req.user._id,
        userName: req.user.name,
        order: order._id,
        orderId: order.orderId,
        foodItems: (order.items || []).map(item => ({
          foodId: item.food,
          name: item.name
        })),
        rating: parsedRating,
        comment: trimmedComment,
        createdAt: new Date()
      };

      store.feedbacks.unshift(newFb);
      return res.status(201).json({ success: true, message: 'Thank you for your feedback!', data: newFb });
    }

    const existingFb = await Feedback.findOne({ order: order._id });
    if (existingFb) {
      return res.status(400).json({ success: false, message: 'Feedback has already been submitted for this order' });
    }

    const feedback = await Feedback.create({
      user: req.user._id,
      userName: req.user.name,
      order: order._id,
      orderId: order.orderId,
      foodItems: (order.items || []).map(item => ({
        foodId: item.food,
        name: item.name
      })),
      rating: parsedRating,
      comment: trimmedComment
    });

    res.status(201).json({ success: true, message: 'Thank you for your feedback!', data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all feedback entries
// @route   GET /api/feedback
// @access  Public
const getAllFeedback = async (req, res) => {
  try {
    if (isFallback()) {
      return res.json({ success: true, count: store.feedbacks.length, data: store.feedbacks });
    }

    const feedbacks = await Feedback.find().sort({ createdAt: -1 }).populate('user', 'name');
    res.json({ success: true, count: feedbacks.length, data: feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  submitFeedback,
  getAllFeedback
};
