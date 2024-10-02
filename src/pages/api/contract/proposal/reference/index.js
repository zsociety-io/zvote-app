import handlers from '@/lib/utils/handlers';
import { referenceProposalContent } from '@/lib/zvote';


export default handlers(
  {
    "POST": post_handler,
  }
);


async function post_handler(req, res) {
  const content = req?.body?.content;
  if (content == null) {
    throw new Error("Content argument is missing.")
  }
  const { formated, hash } = await referenceProposalContent(content);
  await res.status(200).json({ formated, hash });
}