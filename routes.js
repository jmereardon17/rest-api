const express = require('express');
const router = express.Router();
const { authenticateUser } = require('./middleware/auth-user');
const { asyncHandler } = require('./middleware/route-callback');
const { User, Course } = require('./models');

// User Routes ====================================================================

router.get('/users', authenticateUser, (req, res) => {
  const { id, firstName, lastName, emailAddress } = req.currentUser;
  res.status(200).json({ id, firstName, lastName, emailAddress });
});

router.post('/users', asyncHandler(async (req, res) => {
  await User.create(req.body);
  res.status(201).location('/').end();
}));

// Course Routes ====================================================================

router.get('/courses', asyncHandler(async (req, res) => {
  const courses = await Course.findAll({ 
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: [ { model: User.scope('existingUser'), as: 'user' } ]
  });
  res.status(200).json(courses);
}));

router.get('/courses/:id', asyncHandler(async (req, res) => {
  const course = await Course.findOne({
    where: { id: req.params.id },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: [ { model: User.scope('existingUser'), as: 'user' }]
  });

  res.status(course ? 200 : 404).json({ message: course ? course : 'Course Not Found' });
}));

router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
  const course = await Course.create(req.body);
  res.status(201).location(`/courses/${course.id}`).end();
}));

router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);

  if (course) {
    const isOwner = await Course.scope('isOwner', { method: ['isOwner', req.params.id, req.currentUser.id] }).findOne();

    if (isOwner) {
      await course.update(req.body);
      res.status(204).end();
    } else {
      res.status(403).json({ error: 'User is not the owner of the requested course' });
    }
  } else {
    res.status(404).json({ error: 'Course Not Found' });
  }
}));

router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);

  if (course) {
    const isOwner = await Course.scope('isOwner', { method: ['isOwner', req.params.id, req.currentUser.id] }).findOne();
  
    if (isOwner) {
      await course.destroy();
      res.status(204).end();
    } else {
      res.status(403).json({ error: 'User is not the owner of the requested course' });
    }
  } else {
    res.status(404).json({ error: 'Course Not Found' });
  }
}));

module.exports = router;
