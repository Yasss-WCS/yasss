import Slider from "@/ui/slider"

export default async function PrelimsScoresheet() {
    const spreadsheet = '1hpfMHpB5PtLI2immZ0-vlSbAjw0DFTJ_I8376sG8TOE'
    const division = 'Novice'
    const role = 'L'
    const round = '1'
    const url = `https://us-central1-westiecode.cloudfunctions.net/yass-api?action=get_competitors&spreadsheet_id=${spreadsheet}&division=${division}&role=${role}&round=${round}`

    const res = await fetch(url)
    const names = await res.json()


    return (
        <div className="flex flex-col">
            <h1 className="font-bold underline">THE BIG COMPETITION, BABY</h1>
            {names &&
                names.map((name: string, index: number) => (
                    <div className="flex flex-row" key={index}>
                        <div>{name}</div>
                        <Slider id={index} />
                    </div>
                ))}
        </div>
    );
}