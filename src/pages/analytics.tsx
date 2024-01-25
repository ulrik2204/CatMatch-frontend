import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Text,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Toggle from "../components/Toggle";
import { useCatJudgements, useMostLeastLikedCats } from "../helpers/hooks";
import { extractCatBreedFromUrl } from "../helpers/utils";
import { CatJudgement, type CatJudgements } from "../types/catJudgement";

type BreedStats = { breed: string; likes: number; dislikes: number };
type BreedDistribution = { breed: string; count: number };
type Analytics = {
  numberOfCatJudgements: number;
  numberOfLikedCats: number;
  numberOfDislikedCats: number;
  likeDislikeRatio: number;
  catBreedLikesDistribution: BreedDistribution[];
  catBreedDislikesDistribution: BreedDistribution[];
  mostLikedCatBreed: BreedStats;
  leastLikedCatBreed: BreedStats;
};

export default function AnalyticsPage() {
  const { catJudgements } = useCatJudgements();
  const [likesGraph, setLikesGraph] = useState<boolean>(true);
  const analytics = useMemo(() => calculateCatAnalytics(catJudgements), [catJudgements]);
  const mostLeastLikedCats = useMostLeastLikedCats(catJudgements);
  return (
    <div className="flex w-full flex-col items-center pt-8">
      <h1>Analytics</h1>
      {
        <div className="flex w-full flex-col items-center pt-4">
          <div className="flex w-full flex-col items-center pt-4">
            {/*  */}
            <div className="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md ">
              <h2 className="mb-4 text-xl font-semibold text-gray-800">
                Cat Preferences Statistics
              </h2>
              <div className="border-t border-gray-300 pt-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-gray-600">Number of swipes:</span>
                  <span className="font-bold">{analytics.numberOfCatJudgements}</span>
                </div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-gray-600">Liked cats count:</span>
                  <span className="font-bold">{analytics.numberOfLikedCats}</span>
                </div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-gray-600">Disliked cats count:</span>
                  <span className="font-bold">{analytics.numberOfDislikedCats}</span>
                </div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-gray-600">Like-dislike ratio:</span>
                  <span className="font-bold">
                    {(analytics.likeDislikeRatio * 100).toFixed(2)} %
                  </span>
                </div>
                <div className="border-t border-gray-300 pt-4">
                  {/* ... other statistics ... */}
                  <div className="mb-4">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-gray-600">Most liked cat breed:</span>
                      <span className="font-bold">{analytics.mostLikedCatBreed.breed}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="pl-6 text-sm text-gray-500">Likes:</span>
                      <span className="text-sm font-semibold">
                        {analytics.mostLikedCatBreed.likes}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="pl-6 text-sm text-gray-500">Dislikes:</span>
                      <span className="text-sm font-semibold">
                        {analytics.mostLikedCatBreed.dislikes}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-gray-600">Least liked cat breed:</span>
                      <span className="font-bold">{analytics.leastLikedCatBreed.breed}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="pl-6 text-sm text-gray-500">Likes:</span>
                      <span className="text-sm font-semibold">
                        {analytics.leastLikedCatBreed.likes}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="pl-6 text-sm text-gray-500">Dislikes:</span>
                      <span className="text-sm font-semibold">
                        {analytics.leastLikedCatBreed.dislikes}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-5/6 flex-col items-center pt-4 md:w-1/2">
            <h2>Distribution of Likes/Dislikes</h2>
            <Toggle
              checked={likesGraph}
              onChange={setLikesGraph}
              default={true}
              uncheckedTitle="Dislikes"
              checkedTitle="Likes"
            />
            {likesGraph ? (
              <ResponsiveContainer width="100%" height={1000}>
                <BarChart
                  data={analytics.catBreedLikesDistribution}
                  layout="vertical"
                  margin={{ top: 16 }}
                  className="h-96 w-56"
                >
                  <Text />
                  <XAxis dataKey="count" type="number" />
                  {/* Set the YAxis width to make the YAxis labels not cut off  */}
                  <YAxis dataKey="breed" fontSize={14} type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="count"
                    fill="#8884d8"
                    activeBar={<Rectangle fill="purple" stroke="blue" />}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height={1000}>
                <BarChart
                  data={analytics.catBreedDislikesDistribution}
                  layout="vertical"
                  margin={{ top: 16 }}
                  className="h-96 w-56"
                >
                  <Text />
                  <XAxis dataKey="count" type="number" />
                  {/* Set the YAxis width to make the YAxis labels not cut off  */}
                  <YAxis dataKey="breed" fontSize={14} type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="count"
                    fill="#8884d8"
                    activeBar={<Rectangle fill="purple" stroke="blue" />}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="flex w-full flex-col items-center pt-8">
            <h2>Your cat preferences</h2>
            <MostAndLeastLikedCatsDisplay
              mostLikedCats={mostLeastLikedCats?.mostLikedCats}
              leastLikedCats={mostLeastLikedCats?.leastLikedCats}
            />
          </div>
          <div className="h-20"></div>
        </div>
      }
    </div>
  );
}

type MostAndLeastLikedCatsProps = {
  mostLikedCats?: string[];
  leastLikedCats?: string[];
};

function MostAndLeastLikedCatsDisplay(props: MostAndLeastLikedCatsProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <div>
        <h3 className="pt-4 text-center md:text-left">Top Recommended Cats</h3>
        <p>The cats the system predicts you will like the most.</p>
        <div className={`grid grid-cols-1 gap-4 pt-2 md:grid-cols-3`}>
          {props.mostLikedCats?.map((catUrl) => (
            <div key={catUrl} className="mx-auto text-center">
              <h4>{extractCatBreedFromUrl(catUrl)}</h4>
              <img
                draggable={false}
                src={catUrl}
                alt="Picture"
                className="h-64 w-64 object-cover" // Constant size for images
              />
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="pt-4 text-center md:text-left">Bottom Cat Picks</h3>
        <p>The cats the system predicts you will dislike the most.</p>
        <div className={`grid grid-cols-1 gap-4 pt-2 md:grid-cols-3`}>
          {props.leastLikedCats?.map((catUrl) => (
            <div key={catUrl} className="mx-auto text-center">
              <h4>{extractCatBreedFromUrl(catUrl)}</h4>
              <img
                draggable={false}
                src={catUrl}
                alt="Picture"
                className="h-64 w-64 object-cover" // Constant size for images
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
type DistributionType = Record<string, { breed: string; likes: number; dislikes: number }>;

function calculateCatAnalytics(catJudgements: CatJudgements): Analytics {
  // Cat breed distribution
  const catBreedDistributionMap: DistributionType = {};
  for (const catUrl in catJudgements) {
    const breed = extractCatBreedFromUrl(catUrl);
    const judgement = catJudgements[catUrl];
    const inMap = breed in catBreedDistributionMap;
    if (inMap && judgement === CatJudgement.LIKE) {
      catBreedDistributionMap[breed].likes++;
    } else if (inMap && judgement === CatJudgement.DISLIKE) {
      catBreedDistributionMap[breed].dislikes++;
    } else if (!inMap && judgement == CatJudgement.LIKE) {
      catBreedDistributionMap[breed] = { breed: breed, likes: 1, dislikes: 0 };
    } else if (!inMap && judgement == CatJudgement.DISLIKE) {
      catBreedDistributionMap[breed] = { breed: breed, likes: 0, dislikes: 1 };
    }
  }
  const catBreedLikesDistribution = Object.values(catBreedDistributionMap)
    .map((value) => ({ breed: value.breed, count: value.likes }))
    .sort((a, b) => b.count - a.count);
  const catBreedDislikesDistribution = Object.values(catBreedDistributionMap)
    .map((value) => ({
      breed: value.breed,
      count: value.dislikes,
    }))
    .sort((a, b) => b.count - a.count);

  // Simple statistics
  const catJudgeValues = Object.values(catJudgements);
  const numberOfCatJudgements = catJudgeValues.length;
  const numberOfLikedCats = catJudgeValues.filter(
    (judgement) => judgement === CatJudgement.LIKE,
  ).length;
  const numberOfDislikedCats = catJudgeValues.filter(
    (judgement) => judgement === CatJudgement.DISLIKE,
  ).length;
  const likeDislikeRatio = numberOfLikedCats / numberOfCatJudgements;

  // Most and least liked cat breed
  type MostLeastPair = {
    most: { breed: string; likes: number; dislikes: number };
    least: { breed: string; likes: number; dislikes: number };
  };
  const initialMostLeastPair: MostLeastPair = {
    most: { breed: "", likes: 0, dislikes: 0 },
    least: { breed: "", likes: 0, dislikes: Number.MAX_SAFE_INTEGER },
  };
  const { most: mostLikedCatBreed, least: leastLikedCatBreed } = Object.entries(
    catBreedDistributionMap,
  ).reduce((mostLeastPair: MostLeastPair, [breed, obj]) => {
    const most = mostLeastPair.most;
    const least = mostLeastPair.least;
    if (obj.likes > most.likes) {
      most.breed = breed;
      most.likes = obj.likes;
    }
    if (obj.likes < least.dislikes) {
      least.breed = breed;
      least.dislikes = obj.likes;
    }
    return { most, least };
  }, initialMostLeastPair);

  return {
    catBreedLikesDistribution,
    catBreedDislikesDistribution,
    numberOfCatJudgements,
    numberOfLikedCats,
    numberOfDislikedCats,
    likeDislikeRatio,
    mostLikedCatBreed,
    leastLikedCatBreed,
  };
}
