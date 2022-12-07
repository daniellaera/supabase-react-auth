const Profiles = ( {profiles}: any ) => {
    return (
    <>
    {profiles.map(({id, username, company, authorEmail, website}: IProfile, i: number) => (
       <div key={i}>
        <p>{username} - {company} - {authorEmail} - {website}</p>
       </div>
    ))}
    </>
)}

export default Profiles