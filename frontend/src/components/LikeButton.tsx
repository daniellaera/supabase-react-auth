import { IconButton, Stack, Tooltip } from '@chakra-ui/react';
import { HiOutlineThumbUp } from 'react-icons/hi';
import { LIKE_BUTTON_TEXT } from '../utils/constants';
import './LikeButton.css';

interface LikeButtonProps {
  isDisabled: boolean;
  onClick?: () => void;
  likesCount?: number;
}

const LikeButton = ({ isDisabled, onClick, likesCount }: LikeButtonProps) => {
  return (
    <Tooltip placement="left" hasArrow label={LIKE_BUTTON_TEXT} bg={'green.600'}>
      <Stack direction={'row'} justify="end" spacing={6}>
        <div>
          <span className="button__badge">{likesCount ? likesCount : 0}</span>
          <IconButton disabled={isDisabled} aria-label="'Like Button" icon={<HiOutlineThumbUp />} onClick={onClick}/>
        </div>
      </Stack>
    </Tooltip>
  );
};

export default LikeButton;
