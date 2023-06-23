const Competition = {
    name: "Liberty Swing 2023",
    division: "Novice Jack & Jill",
};

function CompetitionCard() {
    return (
        <div>
            <div>Competition:</div>
            <div>{Competition.name}</div>
            <div>{Competition.division}</div>
        </div>
    )
}

export default function admin() {
    return (
    <main>
        <CompetitionCard/>
    </main>
    )
}