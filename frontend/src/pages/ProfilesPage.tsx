import { useEffect, useState } from "react";
import { getProfiles } from "../api";
import { useQuery } from 'react-query';
import Profiles from '../components/Profiles';
import { Progress } from "@chakra-ui/react";

const ProfilesPage = () => {
  const [profiles, setProfiles] = useState<IProfile[]>()

  const fetchProfiles = async () => {
    const res = await getProfiles()
    return res
  };

  const { data: profilesData, error, isError, isLoading } = useQuery('profiles', fetchProfiles, {
    enabled: true, retry: 2, cacheTime: 0, onSuccess(res: any) {
      //console.log(res)
    },
    onError: (error: any) => {
      console.log(error)
    },
    //initialData: () => []
  })

  useEffect(() => {

    if (profilesData) {
      setProfiles(profilesData)
    }

  }, [profilesData])

  if (isLoading) {
    return <Progress size={'xs'} isIndeterminate />
  }
  if (isError) {
    return <div>Error! {(error as Error).message}</div>
  }

  return (
    <>
      {isLoading && <p>Loading posts...</p>}
      {error && <p>{error}</p>}
      {!error && profiles && <Profiles profiles={profiles} />}
    </>
  )
}

export default ProfilesPage

