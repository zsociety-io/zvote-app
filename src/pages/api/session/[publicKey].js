import handlers from '@/lib/utils/handlers';
import {
  get_session
} from '@/lib/authentication';


export default handlers(
  {
    "GET": get_handler,
  }
);

async function get_handler(req, res) {
  await get_session(
    { req, res }, req.query.publicKey
  );

  await res.status(200).json(
    {
      status: "success"
    }
  );
}