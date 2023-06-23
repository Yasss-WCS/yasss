async function GetOAuth(url: string) {

    const res = await fetch(url)

    return res.text()
}

export default async function LoginAuthForm({ url }: string) {
    if (!url) return (<div>...call failed</div>)
    console.log(url)
    const html = await GetOAuth(url)

    return (
        <div dangerouslySetInnerHTML={{ __html: html }} />
    )
}

