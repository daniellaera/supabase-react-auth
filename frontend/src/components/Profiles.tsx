import {
  Heading,
  Avatar,
  Box,
  Text,
  Stack,
  Button,
  useColorModeValue,
  Card,
  CardHeader,
  Flex,
  IconButton,
  CardBody,
  CardFooter,
  Container,
  SimpleGrid,
  Tag
} from '@chakra-ui/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { truncate } from '../utils/functions';
import ProfileAvatar from './ProfileAvatar';

const Profiles = ({ profiles }: any) => {

  const followColor = useColorModeValue('gray.400', 'gray.900');

  return (
    <Container maxW={'7xl'} py={16} as={Stack} spacing={12}>
      <SimpleGrid minChildWidth="120px" spacing="40px" templateColumns="repeat(auto-fill, minmax(400px, 1fr))">
        {profiles.map(({ username, company, authorEmail, website, programmingLanguages, picture }: IProfile, i: number) => (
          <Box key={i}>
            <Card>
              <CardHeader>
                <Flex>
                  <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                    <ProfileAvatar url={picture?.avatarUrl} avatarName={truncate(authorEmail)} />
                    <Box>
                      <Heading size="sm">
                        {username} - {authorEmail}
                      </Heading>
                      <Text>
                        {company} - {website}
                      </Text>
                    </Box>
                  </Flex>
                  <IconButton variant="ghost" colorScheme="gray" aria-label="See menu" icon={<BsThreeDotsVertical />} />
                </Flex>
              </CardHeader>
              <CardBody>
                <Text>
                  With Chakra UI, I wanted to sync the speed of development with the speed of design. I wanted the
                  developer to be just as excited as the designer to create a screen.
                </Text>
                {programmingLanguages.map((value, index) => (
                  <Tag margin={2} key={index}>
                    {value.language}
                  </Tag>
                ))}
              </CardBody>

              <CardFooter
                justify="space-between"
                flexWrap="wrap"
                sx={{
                  '& > button': {
                    minW: '136px'
                  }
                }}>
                <Button
                  w={'xl'}
                  mt={8}
                  bg={followColor}
                  color={'white'}
                  rounded={'md'}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg'
                  }}>
                  Follow
                </Button>
              </CardFooter>
            </Card>
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default Profiles;
