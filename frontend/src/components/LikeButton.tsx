import { IconButton, Stack, Tooltip } from '@chakra-ui/react';
import { HiOutlineThumbUp } from 'react-icons/hi';
import { LIKE_BUTTON_TEXT } from '../utils/constants';
import './LikeButton.css';

const LikeButton = () => {
  return (
    <Tooltip placement="left" hasArrow label={LIKE_BUTTON_TEXT} bg={'green.600'}>
      <Stack direction={'row'} justify="end" spacing={6}>
        <div>
          <span className="button__badge">4</span>
          <IconButton aria-label="'Like Button" icon={<HiOutlineThumbUp />} />
        </div>
      </Stack>
    </Tooltip>
  );
};

export default LikeButton;
