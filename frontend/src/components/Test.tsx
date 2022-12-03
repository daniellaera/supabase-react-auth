import {
  Heading,
  Avatar,
  Box,
  Center,
  Text,
  Stack,
  Button,
  Link,
  Badge,
  useColorModeValue,
  Card,
  CardHeader,
  Flex,
  IconButton,
  CardBody,
  Image,
  CardFooter,
  useToast,
  Progress,
} from '@chakra-ui/react';
import { Session } from "@supabase/supabase-js";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { getPictureByProfileId, getProfileByAuthorEmail } from "../api";
import { supabaseClient } from "../config/supabase-client";
import { useQuery } from 'react-query';
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiLike, BiChat, BiShare } from "react-icons/bi";

const Test = () => {
  const [session, setSession] = useState<Session | null>();
  const [profile, setProfile] = useState<IProfile>()
  const [picture, setPicture] = useState<IPicture>()
  const toast = useToast();

  const color = useColorModeValue('white', 'gray.900');
  const color2 = useColorModeValue('gray.700', 'gray.400')
  const color3 = useColorModeValue('gray.50', 'gray.800')
  const color4 = useColorModeValue('gray.50', 'gray.800')
  const color5 = useColorModeValue('gray.50', 'gray.800')

  const fetchProfilePicture = async () => {
    const res: AxiosResponse<ApiDataType> = await getPictureByProfileId(profile?.id!)
    return res.data
  }

  const { data: pictureData, isLoading, error, isError, refetch } = useQuery(['profilePicture'], fetchProfilePicture, {
    enabled: false, retry: 2, cacheTime: 0, onSuccess(res: IPicture) {
      console.log('res picture here', res)
    },
    onError: () => {
      console.log(error)
    }
  })

  const fetchProfile = async () => {
    const res: AxiosResponse<ApiDataType> = await getProfileByAuthorEmail(session?.user?.email!)
    return res.data;
  };

  const { data: profileData, error: profileError, isLoading: isFetchingProfile, isIdle } = useQuery(['profile'], fetchProfile, {
    enabled: false, retry: 2, cacheTime: 0, onSuccess(res: IProfile) {
      console.log('res here', res)
    },
    onError: (error) => {
      console.log(error)
    }
  });

  useEffect(() => {
    const setData = async () => {
      const { data: { session }, error } = await supabaseClient.auth.getSession();
      if (error) throw error;
      setSession(session);
    };

    setData();

    if (profileData) {
      setProfile(profileData)
    }
    if (pictureData) {
      setPicture(pictureData)
    }

  }, [profileData, pictureData])

  if (isFetchingProfile) return <Progress size={'xs'} isIndeterminate />

  return (
    <Center py={6}>
      <Card maxW='md'>
        <CardHeader>
          <Flex >
            <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
              <Avatar name='Segun Adebayo' src='https://bit.ly/sage-adebayo' />

              <Box>
                <Heading size='sm'>Segun Adebayo</Heading>
                <Text>Creator, Chakra UI</Text>
              </Box>
            </Flex>
            <IconButton
              variant='ghost'
              colorScheme='gray'
              aria-label='See menu'
              icon={<BsThreeDotsVertical />}
            />
          </Flex>
        </CardHeader>
        <CardBody>
          <Text>
            With Chakra UI, I wanted to sync the speed of development with the speed
            of design. I wanted the developer to be just as excited as the designer to
            create a screen.
          </Text>
        </CardBody>
        <Image
          objectFit='cover'
          src='https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
          alt='Chakra UI'
        />

        <CardFooter
          justify='space-between'
          flexWrap='wrap'
          sx={{
            '& > button': {
              minW: '136px',
            },
          }}
        >
          <Button flex='1' variant='ghost' leftIcon={<BiLike />}>
            Like
          </Button>
          <Button flex='1' variant='ghost' leftIcon={<BiChat />}>
            Comment
          </Button>
          <Button flex='1' variant='ghost' leftIcon={<BiShare />}>
            Share
          </Button>
        </CardFooter>
      </Card>
    </Center>
  )
}

export default Test