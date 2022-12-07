import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, useColorModeValue } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const ProfilesActions = () => {
  return (
    <Box px={4} bg={useColorModeValue('gray.100', 'gray.700')}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Link to="/post/new">
          <Button
            variant={'solid'}
            colorScheme={'teal'}
            size={'sm'}
            mr={4}
            leftIcon={<AddIcon />}>
            Add Profile
          </Button>
        </Link>
      </Flex>
    </Box>
  );
}

export default ProfilesActions;