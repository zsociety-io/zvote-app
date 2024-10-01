import handlers from '@/lib/utils/handlers';
import { getUserTokens } from '@/lib/zvote'

export default handlers(
  {
    "GET": get_handler,
  }
);

async function get_handler(req, res) {
  const balances = await getUserTokens(
    req.query.publicKey,
    [req.query.tokenId]
  );
  await res.status(200).json(
    Object.values(balances)[0]
  );
}