import handlers from 'lib/utils/handlers';
import { programIdToAddress } from 'lib/aleo';


export default handlers(
  {
    "GET": get_handler,
  }
);

async function get_handler(req, res) {
  await res.status(200).json(
    {
      address: programIdToAddress(
        req.query.programId
      )
    }
  );
}