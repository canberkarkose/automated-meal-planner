import {
  Box, Typography, Tooltip, Button,
  IconButton
} from '@mui/material';
import { useRef, useState, useEffect } from 'react';
import parse from 'html-react-parser';
import sanitizeHtml from 'sanitize-html';
import AddIcon from '@mui/icons-material/Add';

import {
  RecipeCardContainer, RecipeImage, DescriptionContainer, PlaceholderImage
} from './RecipeCard.styles';

interface RecipeCardProps {
  image?: string;
  title: string;
  description?: string;
  onSeeMore: () => void;
  showAddButton?: boolean;
  onAddToMealPlan?: () => void;
  isAddButtonDisabled?: boolean;
}

export const RecipeCard = ({
  image, title, description, onSeeMore, showAddButton, onAddToMealPlan, isAddButtonDisabled
}: RecipeCardProps) => {
  const titleRef = useRef<HTMLDivElement>(null);
  const [isTitleTruncated, setIsTitleTruncated] = useState(false);

  let sanitizedDescription = '';
  if (description) {
    sanitizedDescription = sanitizeHtml(description, {
      allowedTags: sanitizeHtml.defaults.allowedTags.filter((tag: string) => tag !== 'a'),
    });
  }

  useEffect(() => {
    if (titleRef.current) {
      setIsTitleTruncated(titleRef.current.scrollWidth > titleRef.current.clientWidth);
    }
  }, [title]);

  return (
    <RecipeCardContainer>
      {image ? (
        <RecipeImage src={image} alt={title} />
      ) : (
        <PlaceholderImage>
          <Typography variant='body2' color='textSecondary' fontSize='1rem'>
            Image Unavailable
          </Typography>
        </PlaceholderImage>
      )}
      <Box padding='8px'>
        {isTitleTruncated ? (
          <Tooltip title={title} arrow disableInteractive>
            <Typography
              ref={titleRef}
              variant='h6'
              fontWeight='bold'
              gutterBottom
              textAlign='center'
              sx={{
                mt: -2,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                fontSize: '18px',
              }}
            >
              {title}
            </Typography>
          </Tooltip>
        ) : (
          <Typography
            ref={titleRef}
            variant='h6'
            fontWeight='bold'
            gutterBottom
            textAlign='center'
            sx={{
              mt: -2,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              fontSize: '18px',
            }}
          >
            {title}
          </Typography>
        )}
        {description && (
          <DescriptionContainer>
            <Typography
              variant='body2'
              sx={{
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 8,
                textOverflow: 'ellipsis',
                fontSize: '15px',
              }}
            >
              {parse(sanitizedDescription)}
            </Typography>
          </DescriptionContainer>
        )}
        <Button
          variant='contained'
          sx={{
            mt: '16px',
            ml: 'auto',
            mr: 'auto',
            display: 'block',
            backgroundColor: '#89a313',
            '&:hover': {
              backgroundColor: '#5d6e0d'
            }
          }}
          onClick={onSeeMore}
        >
          See More
        </Button>
      </Box>
      {showAddButton && (
        <Tooltip title='Add to meal plan' arrow>
          <IconButton
            onClick={onAddToMealPlan}
            disabled={isAddButtonDisabled}
            sx={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              backgroundColor: '#89a313',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#5d6e0d',
              },
            }}
            size='large'
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      )}
    </RecipeCardContainer>
  );
};
