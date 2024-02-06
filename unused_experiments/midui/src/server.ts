const server = Bun.serve({
  port: 8888,
  development: true,
  async fetch(req) {
    console.log(`Fetching: ${req.url}`)

    const requestPath = new URL(req.url).pathname

    switch (requestPath) {
      case '/': {
        const builtFiles = await Bun.build({ // build each time, everything always fresh
          entrypoints: [`${import.meta.dir}/index.ts`],
        })

        for (const res of builtFiles.logs) console.log(res) // log any error/warning

        let built = `
<html>
<head>
<title>Bunana</title>
<script>
${await builtFiles.outputs[0].text()}
</script>
</head>
<body></body>
</html>
`

        const res = new Response(built, {
          headers: { 'Content-Type': 'text/html' },
        })
        return res
      }
      default:
        return new Response(Bun.file(`${import.meta.dir}/../${requestPath}`))
    }
  }
})

console.log(`Serving at http://localhost:${server.port} ...`)
