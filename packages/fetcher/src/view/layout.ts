export const layout = (inner: string) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Flowerpot Quotes</title>
    <link rel="stylesheet" href="https://unpkg.com/@picocss/pico@latest/css/pico.min.css">
</head>
<body>
 <main class="container">
    ${inner}
    </main>
</body>
</html>`
}

export const base = () => {
    return layout(`<p>Oops the timestamp you've input wasn't found</p>`)
}