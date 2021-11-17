import {
  List,
  ListItem,
  ListIcon,
  Heading,
  Text,
  Circle,
  Box,
} from "@chakra-ui/react";
import { useMediaQuery } from "@mui/material";
import { CheckCircleIcon } from "@chakra-ui/icons";

import { IoClose } from "react-icons/io5";
import { FaShareAlt, FaArrowAltCircleLeft } from "react-icons/fa";

import HeaderLogo from "../../components/HeaderLogo";
import { HeaderWelcome } from "../../components/HeaderWelcome";

import { useHistory, useParams } from "react-router";
import { useSharedRecipes } from "../../providers/recipes";
import { useMyRecipes } from "../../providers/MyRecipes";

const RecipeDetailsPrivate = () => {
  const history = useHistory();
  const parameters = useParams();
  const recipeId = parameters.idRecipes;

  const {
    recipes,
    recipePrivateDetails,
    shareRecipe,
    deleteOrUnshareSharedRecipes,
  } = useSharedRecipes();

  const { deleteRecipe, getMyRecipes } = useMyRecipes();

  const localToken = localStorage.getItem("@cookin:accessToken") || "";

  const user = localStorage.getItem("@cookin:user") || "";
  const userId = JSON.parse(user).id;

  const isShared = recipes.some((recipe) => recipe.id === Number(recipeId));

  const isLagerThan768 = useMediaQuery("(min-width: 768px)");

  const handleDeleteRecipe = (privateId) => {
    deleteRecipe(privateId, localToken, userId);

    let foundPublicRecipe = recipes.find(
      (item) => item.myrecipesId === privateId
    );
    let publicId = 0;

    if (foundPublicRecipe !== undefined) {
      publicId = foundPublicRecipe.id;
    }
    foundPublicRecipe && deleteOrUnshareSharedRecipes(publicId, localToken);
  };

  return (
    <>
      {isLagerThan768 && <HeaderWelcome />}
      {isLagerThan768 && <HeaderLogo />}
      <Box margin="0 auto" position="relative" w={["100%", "100%", "700px"]}>
        <Box
          padding="20px"
          color="gray.900"
          w={["100%", "100%", "450px"]}
          margin={["", "", "0 auto"]}
          textAlign={["", "", "center"]}
          paddingTop={["60px", "60px", "20px"]}
          backgroundColor={["orange.50", "orange.50", "white.50"]}
        >
          <Heading as="h1" size="lg" color="orange.400">
            {recipePrivateDetails.title}
          </Heading>
          <Box display="flex" padding="10px 0px">
            <Text>Receita de &nbsp;</Text>
            <Text color="pink.400">{recipePrivateDetails.author}</Text>
          </Box>
          <Box
            display="flex"
            position="absolute"
            fontSize="30px"
            color="orange.700"
            top={["18px", "18px", "50px"]}
            left={["20px", "20px", "5px"]}
          >
            <Box as="button" onClick={() => history.push("/myrecipes")}>
              <FaArrowAltCircleLeft />
            </Box>
          </Box>
          <Box
            display="flex"
            position="absolute"
            fontSize="18px"
            top={["8px", "8px", "40px"]}
            right={["10px", "10px", "5px"]}
          >
            {isShared ? (
              <Box
                as="button"
                margin="2px"
                borderRadius="100%"
                padding="10px"
                backgroundColor="#ededed"
                boxShadow="0 0 0.4em #ededed"
                /*Para des-compartilhar*/
                onClick={() => {
                  deleteOrUnshareSharedRecipes(recipeId, localToken);
                }}
              >
                <FaShareAlt style={{ color: "#C8561F" }} />
              </Box>
            ) : (
              <Box
                as="button"
                margin="2px"
                borderRadius="100%"
                padding="10px"
                backgroundColor="#ededed"
                boxShadow="0 0 0.4em #ededed"
                /*Para compartilhar*/
                onClick={() => {
                  shareRecipe(recipePrivateDetails, localToken);
                }}
              >
                <FaShareAlt style={{ color: "#979797" }} />
              </Box>
            )}
            <Box
              as="button"
              margin="2px"
              borderRadius="100%"
              padding="8px"
              backgroundColor="#ededed"
              boxShadow="0 0 0.4em #ededed"
              /*Para excluir*/
              onClick={() => {
                handleDeleteRecipe(Number(recipeId));
                getMyRecipes(localToken, userId);
              }}
            >
              <IoClose style={{ color: "#EB1616", fontSize: "22px" }} />
            </Box>
          </Box>
        </Box>
        <Box
          paddingTop={["10px"]}
          borderTop={["", "", "1px solid #c0c0c0"]}
          borderBottom={["", "", "1px solid #c0c0c0"]}
        >
          <Heading
            as="h2"
            size="md"
            color="orange.400"
            marginLeft={["10px", "10px", "40px"]}
          >
            Ingredientes
          </Heading>
          <List
            display="flex"
            flexWrap="wrap"
            padding="10px 0px"
            w={["290px", "290px", "620px"]}
            margin={["", "", "0 auto"]}
            marginLeft={["10px", "10px"]}
          >
            {recipePrivateDetails.ingredients?.map((item, index) => (
              <ListItem
                key={index}
                display="flex"
                alignItems="center"
                padding="5px 0px"
                w={["290px", "290px", "310px"]}
              >
                <ListIcon as={CheckCircleIcon} color="orange.400" />
                {item}
              </ListItem>
            ))}
          </List>
        </Box>
        <Box paddingTop="10px">
          <Heading
            as="h2"
            size="md"
            color="orange.400"
            marginLeft={["10px", "10px", "40px"]}
          >
            Modo de Preparo
          </Heading>
          <Box
            padding="10px 0px"
            margin={["", "0 auto"]}
            marginLeft={["10px", "10px"]}
            w={["300px", "300px", "620px"]}
          >
            <List>
              {recipePrivateDetails.instructions?.map((item, index) => (
                <ListItem
                  key={index}
                  display="flex"
                  padding="5px 0px"
                  alignItems="center"
                  textAlign="justify"
                >
                  <Circle
                    size="26px"
                    bg="purple.400"
                    color="white"
                    marginRight="10px"
                  >
                    {index + 1}
                  </Circle>
                  {item}
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default RecipeDetailsPrivate;
