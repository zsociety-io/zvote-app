export default function handlers(methods_handlers, skip_staging_check) {
  return async (req, res) => {
    try {
      if (Object.keys(methods_handlers).includes(req.method))
        return await (methods_handlers[req.method])(req, res)
      throw `Unexpected method: '${req.method}'`;
    }
    catch (request_processing_error) {
      if (
        request_processing_error.stack
      ) {
        console.log()
        console.log(request_processing_error.stack)
      }
      res.status(400).json({ error: '' + request_processing_error });
    }
  }
}