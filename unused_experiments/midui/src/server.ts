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
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Bunana</title>
</head>
<body>
<style>
body {
  font: 16px system-ui;
  user-select: none; /* no text selection needed */
  -webkit-user-select: none; /* no text selection needed */
  background-color: #eee;
  overflow: hidden; /* prevent accidentally dragging the viewport on iOS */
  margin: 0;
}
.row {
  position: absolute;
  display: grid;
  place-items: center;
  overflow: hidden; /* height might be small during animation */
  transition: box-shadow 0.25s ease-out, opacity 0.25s ease-out;
}
</style>
</body>
<script>
${await builtFiles.outputs[0].text()}
</script>
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
