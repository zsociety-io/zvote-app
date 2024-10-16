import handlers from '@/lib/utils/handlers';
import { hashStruct } from '@/lib/aleo';


export default handlers(
  {
    "GET": get_handler,
  }
);

async function get_handler(req, res) {
  const token_id = "666field";
  const account = "";
  const token_owner = `{account: ${account}, token_id: ${token_id}}`;
  hashStruct();
  await res.status(200).json(
    {
      hash: hashStruct(
        req.query.struct
      )
    }
  );
}