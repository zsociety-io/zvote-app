import handlers from '@/lib/utils/handlers';
import { getAddressDaos } from '@/lib/zvote';


export default handlers(
  {
    "GET": get_handler,
  }
);

async function get_handler(req, res) {
  const daos = await getAddressDaos(
    req.query.publicKey
  );
  console.log({ daos })
  await res.status(200).json(
    daos
  );
}
