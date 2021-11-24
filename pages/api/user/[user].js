import createConnection from '@utils/createConnection';
import User from '@models/UserSchema';

async function handler(req, res) {
  // Create connection to database
  await createConnection();

  // Unpack the request
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case 'PUT':
      try {
        const user = await User.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });

        if (!user) return res.status(400).json({ success: false });

        res.status(200).json({ success: true, data: user });
      } catch (err) {
        res.status(400).json({ success: false, msg: err });
      }
      break;

    case 'GET':
      try {
        const user = await User.findById(id);
        if (!user) return res.status(400).json({ success: false });

        res.status(200).json({ success: true, data: user });
      } catch (err) {
        res.status(400).json({ success: false, msg: err });
      }
      break;

    case 'DELETE':
      try {
        const deletedUser = await User.deleteOne({ _id: id });
        if (!deletedUser) return res.status(400).json({ success: false });

        res.status(200).json({ success: true, data: {} });
      } catch (err) {
        res.status(400).json({ success: false, msg: err });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}

export default handler;
