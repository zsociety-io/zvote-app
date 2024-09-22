import handlers from '@/lib/utils/handlers';
import { getAddressDaos } from '@/lib/zvote';


export default handlers(
  {
    "GET": get_handler,
  }
);

async function get_handler(req, res) {
  await res.status(200).json(
    await getAddressDaos(
      req.query.publicKey
    )
  );
}
