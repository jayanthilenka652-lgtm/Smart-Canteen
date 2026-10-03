const Notification = require('../models/Notification');
const { isFallback, store } = require('../config/db');

const createNotification = async ({ userId, orderId, order, message, type = 'status_update' }) => {
  if (!userId || !message) return null;

  const normalizedOrderId = orderId || order?.orderId || '';
  const normalizedOrder = order?._id || order || null;

  if (isFallback()) {
    const matched = store.notifications.find((note) => {
      if (note.user !== userId) return false;
      if (note.type !== type) return false;
      if (normalizedOrder) {
        return note.order === normalizedOrder || note.orderId === normalizedOrderId;
      }
      return note.orderId === normalizedOrderId || note.message === message;
    });

    if (matched) return matched;

    const notification = {
      _id: 'notification_' + Date.now() + Math.random().toString(16).slice(2),
      user: userId,
      order: normalizedOrder,
      orderId: normalizedOrderId,
      type,
      message,
      isRead: false,
      createdAt: new Date()
    };

    store.notifications.unshift(notification);
    return notification;
  }

  const existing = await Notification.findOne({ user: userId, type, ...(normalizedOrder ? { order: normalizedOrder } : {}), ...(normalizedOrderId ? { orderId: normalizedOrderId } : {}) });
  if (existing) return existing;

  const notification = await Notification.create({
    user: userId,
    order: normalizedOrder,
    orderId: normalizedOrderId,
    type,
    message
  });

  return notification;
};

const getNotifications = async (req, res) => {
  try {
    if (isFallback()) {
      const list = [...store.notifications.filter((n) => n.user === req.user._id)].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json({ success: true, count: list.length, unreadCount: list.filter((n) => !n.isRead).length, data: list });
    }

    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: notifications.length,
      unreadCount: notifications.filter((n) => !n.isRead).length,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    if (isFallback()) {
      const note = store.notifications.find((n) => n._id === req.params.id && n.user === req.user._id);
      if (!note) return res.status(404).json({ success: false, message: 'Notification not found' });
      note.isRead = true;
      return res.json({ success: true, message: 'Notification marked as read', data: note });
    }

    const note = await Notification.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { isRead: true }, { new: true });
    if (!note) return res.status(404).json({ success: false, message: 'Notification not found' });
    res.json({ success: true, message: 'Notification marked as read', data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const markAllNotificationsRead = async (req, res) => {
  try {
    if (isFallback()) {
      store.notifications = store.notifications.map((n) => n.user === req.user._id ? { ...n, isRead: true } : n);
      return res.json({ success: true, message: 'All notifications marked as read' });
    }

    await Notification.updateMany({ user: req.user._id, isRead: false }, { $set: { isRead: true } });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead
};
