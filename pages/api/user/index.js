import createConnection from '@utils/createConnection';
import User from '@models/UserSchema';

async function handler(req, res) {
  // Create connection to database
  await createConnection();

  // Unpack the request
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const users = await User.find({});

        res.status(200).json({ success: true, data: users });
      } catch (err) {
        res.status(400).json({ success: false, msg: err });
      }
      break;

    case 'POST':
      try {
        const user = await User.creat(req.body);

        res.status(201).json({ success: true, data: user });
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
