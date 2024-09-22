import handlers from '@/lib/utils/handlers';
import { getDao } from '@/lib/zvote';


export default handlers(
  {
    "GET": get_handler,
  }
);

async function get_handler(req, res) {
  await res.status(200).json(
    await getDao(
      req.query.publicKey
    )
  );
}
