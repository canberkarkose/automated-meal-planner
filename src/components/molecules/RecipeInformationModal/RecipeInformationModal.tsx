import React, { useState, useEffect } from 'react';
import {
  Modal, Box, IconButton, CircularProgress,
  Typography,
  Stepper,
  Step
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';

import parse from 'html-react-parser';
import sanitizeHtml from 'sanitize-html';

import {
  PieChart, Pie, Cell, Tooltip, Legend
} from 'recharts';

import {
  ModalContent,
  ModalContainer,
  Title,
  RecipeImage,
  PlaceholderImage,
  Description,
  ContentContainer,
  InfoRow,
  InfoItem,
  InfoTitle,
  InfoValue,
  InfoRowInner,
  CaloriesContainer,
  InfoText,
  CalorieBreakdownText,
  IngredientList,
  IngredientItem,
  IngredientText,
  IngredientImage,
  PlaceholderIngredientImage,
  InstructionsContainer,
  InstructionTitle,
  StepTextBox,
  StepText,
  CustomStepButton,
  InstructionList,
  InstructionListContainer,
  InstructionListImage,
  InstructionListItem,
  InstructionListItems,
  InstructionListText,
  InstructionListTitle,
  PlaceholderInstructionListImage
} from './RecipeInformationModal.styles';

import { getImageSrc } from './helpers';

import { RecipeInformation } from '@components/pages/App/Recipes/Recipes.types';

interface RecipeInformationModalProps {
  open: boolean;
  onClose: () => void;
  isLoading: boolean;
  recipeInfo: RecipeInformation | null;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export const RecipeInformationModal: React.FC<RecipeInformationModalProps> = ({
  open,
  onClose,
  isLoading,
  recipeInfo,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  useEffect(() => {
    if (open) {
      setActiveStep(0);
    }
  }, [open]);
  const title = recipeInfo?.title || '-';
  const image = recipeInfo?.image || '';
  const summary = recipeInfo?.summary || '-';
  const caloricBreakdown = recipeInfo?.nutrition?.caloricBreakdown || {
    percentProtein: 0,
    percentFat: 0,
    percentCarbs: 0,
  };
  const readyInMinutes = recipeInfo?.readyInMinutes || '-';
  const servings = recipeInfo?.servings || '-';
  const nutrients = recipeInfo?.nutrition?.nutrients || [];
  const caloriesInfo = nutrients.find((nutrient) => nutrient.name === 'Calories');
  const extendedIngredients = recipeInfo?.extendedIngredients || [];
  const instructions = recipeInfo?.analyzedInstructions?.[0]?.steps || [];

  const caloriesPerServing = caloriesInfo
    ? `${caloriesInfo.amount} ${caloriesInfo.unit}`
    : '-';

  const sanitizedSummary = sanitizeHtml(summary, {
    allowedTags: sanitizeHtml.defaults.allowedTags.filter((tag: string) => tag !== 'a'),
  });

  const pieChartData = Object.entries(caloricBreakdown).map(([key, value]) => ({
    name: key.replace('percent', ''),
    value,
  }));

  const hasIngredients = instructions[activeStep]?.ingredients?.length > 0;
  const hasEquipment = instructions[activeStep]?.equipment?.length > 0;
  const numLists = (hasIngredients ? 1 : 0) + (hasEquipment ? 1 : 0);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby='recipe-information-modal'
      aria-describedby='modal-with-recipe-information'
      closeAfterTransition
      keepMounted
    >
      <Slide in={open} timeout={500} direction='down' mountOnEnter unmountOnExit>
        <ModalContent>
          <IconButton
            onClick={onClose}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          {isLoading ? (
            <Box
              display='flex'
              justifyContent='center'
              alignItems='center'
              flexGrow={1}
            >
              <CircularProgress />
            </Box>
          ) : (
            <ModalContainer>
              <Title variant='h5'>
                {title}
              </Title>
              <ContentContainer>
                {image ? (
                  <RecipeImage src={image} alt={title} />
                ) : (
                  <PlaceholderImage>
                    <Typography
                      variant='body2'
                      color='textSecondary'
                      fontSize='1rem'
                    >
                      Image Unavailable
                    </Typography>
                  </PlaceholderImage>
                )}
                <Description>{parse(sanitizedSummary)}</Description>
              </ContentContainer>
              <InfoRow>
                <InfoItem>
                  <CalorieBreakdownText>Caloric Breakdown</CalorieBreakdownText>
                  <PieChart width={200} height={200}>
                    <Pie
                      data={pieChartData}
                      dataKey='value'
                      nameKey='name'
                      cx='50%'
                      cy='50%'
                      outerRadius={70}
                      fill='#8884d8'
                    >
                      {pieChartData.map((_entry, index) => (
                        <Cell
                          // eslint-disable-next-line react/no-array-index-key
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend iconSize={10} />
                  </PieChart>
                </InfoItem>
                <InfoItem>
                  <Box sx={
                    {
                      backgroundColor: '#ededed',
                      borderRadius: '12px',
                      padding: '16px',
                      marginLeft: '20px',
                    }
                  }
                  >
                    <InfoRowInner>
                      <InfoText>
                        <InfoTitle>Ready in:</InfoTitle>
                        <InfoValue>
                        &nbsp;
                          {readyInMinutes}
                          {' '}
                          minutes
                        </InfoValue>
                      </InfoText>
                      <InfoText>
                        <InfoTitle>Servings:</InfoTitle>
                        <InfoValue>
                        &nbsp;
                          {servings}
                        </InfoValue>
                      </InfoText>
                    </InfoRowInner>
                    <CaloriesContainer>
                      <InfoText>
                        <InfoTitle>Calories per serving:</InfoTitle>
                        <InfoValue>
                        &nbsp;
                          {caloriesPerServing}
                        </InfoValue>
                      </InfoText>
                    </CaloriesContainer>
                  </Box>
                </InfoItem>
                <InfoItem sx={{ flex: 1 }}>
                  <InfoTitle>Ingredients</InfoTitle>
                  <IngredientList>
                    {extendedIngredients.map((ingredient) => (
                      <IngredientItem key={ingredient.id}>
                        <IngredientText>{ingredient.original}</IngredientText>
                        {ingredient.image ? (
                          <IngredientImage
                            src={`https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}`}
                            alt={ingredient.name}
                          />
                        ) : (
                          <PlaceholderIngredientImage>
                            No Image
                          </PlaceholderIngredientImage>
                        )}
                      </IngredientItem>
                    ))}
                  </IngredientList>
                </InfoItem>
              </InfoRow>
              {instructions.length > 0 && (
              <InstructionsContainer>
                <InstructionTitle>Step by Step Implementation</InstructionTitle>
                <Stepper
                  nonLinear
                  activeStep={activeStep}
                  sx={{
                    '& .MuiStepIcon-root': {
                      fontSize: '1.5rem', // Adjust this value to make the buttons larger or smaller
                    },
                  }}
                >
                  {instructions.map((step, index) => (
                    <Step key={step.number} expanded>
                      <CustomStepButton sx={{ size: 50 }} onClick={() => setActiveStep(index)} />
                    </Step>
                  ))}
                </Stepper>
                {instructions[activeStep] && (
                <Box mt={2}>
                  <StepTextBox>
                    <StepText>{instructions[activeStep].step}</StepText>
                  </StepTextBox>
                  {(hasIngredients || hasEquipment) && (
                  <InstructionListContainer
                    sx={{ justifyContent: numLists === 1 ? 'center' : 'space-between' }}
                  >
                    {hasIngredients && (
                    <InstructionList>
                      <InstructionListTitle>Step Ingredients</InstructionListTitle>
                      <InstructionListItems>
                        {instructions[activeStep].ingredients.map((ingredient) => (
                          <InstructionListItem key={ingredient.id}>
                            <InstructionListText>{ingredient.name}</InstructionListText>
                            {ingredient.image ? (
                              <InstructionListImage
                                src={getImageSrc(ingredient.image, 'ingredient')}
                                alt={ingredient.name}
                              />
                            ) : (
                              <PlaceholderInstructionListImage>
                                No Image
                              </PlaceholderInstructionListImage>
                            )}
                          </InstructionListItem>
                        ))}
                      </InstructionListItems>
                    </InstructionList>
                    )}
                    {hasEquipment && (
                    <InstructionList>
                      <InstructionListTitle>Step Equipment</InstructionListTitle>
                      <InstructionListItems>
                        {instructions[activeStep].equipment.map((equipment) => (
                          <InstructionListItem key={equipment.id}>
                            <InstructionListText>{equipment.name}</InstructionListText>
                            {equipment.image ? (
                              <InstructionListImage
                                src={getImageSrc(equipment.image, 'equipment')}
                                alt={equipment.name}
                              />
                            ) : (
                              <PlaceholderInstructionListImage>
                                No Image
                              </PlaceholderInstructionListImage>
                            )}
                          </InstructionListItem>
                        ))}
                      </InstructionListItems>
                    </InstructionList>
                    )}
                  </InstructionListContainer>
                  )}
                </Box>
                )}
              </InstructionsContainer>
              )}
            </ModalContainer>
          )}
        </ModalContent>
      </Slide>
    </Modal>
  );
};