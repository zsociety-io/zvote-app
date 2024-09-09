import handlers from 'lib/utils/handlers';
import {
  delete_session
} from 'lib/authentication';


export default handlers(
  {
    "GET": get_handler,
  }
);

async function get_handler(req, res) {
  await delete_session(
    { req, res }, req.query.publicKey
  );

  await res.status(200).json(
    {
      status: "success"
    }
  );
}