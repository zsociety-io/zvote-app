import handlers from '@/lib/utils/handlers';
import {
  generate_session_token
} from '@/lib/authentication';


export default handlers(
  {
    "GET": get_handler,
  }
);

async function get_handler(req, res) {
  const handshake_token = await generate_session_token(
    { req, res }, req.query.signedMessage
  );

  await res.status(200).json(
    {
      token: handshake_token,
      time: Date.now()
    }
  );
}