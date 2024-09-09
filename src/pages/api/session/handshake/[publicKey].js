import handlers from 'lib/utils/handlers';
import {
  create_handshake_token
} from 'lib/authentication';


export default handlers(
  {
    "GET": get_handler,
  }
);

async function get_handler(req, res) {
  const handshake_token = await create_handshake_token(
    req.query.publicKey
  );

  await res.status(200).json(
    {
      token: handshake_token,
      time: Date.now()
    }
  );
}