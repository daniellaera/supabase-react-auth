import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Flex } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const PostActions = () => {
  return (
    <Box px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Link to="/post/new">
          <Button
            variant={'solid'}
            colorScheme={'teal'}
            size={'sm'}
            mr={4}
            leftIcon={<AddIcon />}>
            Add Post
          </Button>
        </Link>
      </Flex>
    </Box>
  );
}

export default PostActions;