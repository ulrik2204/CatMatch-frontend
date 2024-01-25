import { useMemo } from "react";
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
import { useCatJudgements, useMostLeastLikedCats } from "../helpers/hooks";
import { extractCatBreedFromUrl } from "../helpers/utils";
import { CatJudgement, type CatJudgements } from "../types/catJudgement";

type Analytics = {
  numberOfCatJudgements: number;
  numberOfLikedCats: number;
  numberOfDislikedCats: number;
  likeDislikeRatio: number;
  catBreedDistribution: { breed: string; count: number }[];
  mostLikedCatBreed: { breed: string; count: number };
  leastLikedCatBreed: { breed: string; count: number };
};

export default function AnalyticsPage() {
  const { catJudgements } = useCatJudgements();
  const analytics = useMemo(() => calculateCatAnalytics(catJudgements), [catJudgements]);
  const mostLeastLikedCats = useMostLeastLikedCats(catJudgements);
  return (
    <div className="flex w-full flex-col items-center pt-8">
      <h1>Analytics</h1>
      <div className="flex h-8 flex-col items-center">
        {/* {loading && <div>Updating...</div>}
        <div>{errorReasons?.map((reason) => <div>{reason}</div>)}</div> */}
      </div>
      {
        <div className="flex w-full flex-col items-center pt-4">
          <div className="pt-2">
            <div>Number of swipes: {analytics.numberOfCatJudgements}</div>
            <div>Liked cats count: {analytics.numberOfLikedCats}</div>
            <div>Disliked cats count: {analytics.numberOfDislikedCats}</div>
            <div>Like-dislike ratio: {analytics.likeDislikeRatio} %</div>
            <div>
              Most liked cat breed: {analytics.mostLikedCatBreed.breed} (likes:{" "}
              {analytics.mostLikedCatBreed.count})
            </div>
            <div>
              Least liked cat breed: {analytics.leastLikedCatBreed.breed} (likes:{" "}
              {analytics.leastLikedCatBreed.count})
            </div>
          </div>
          <div className="flex w-5/6 flex-col items-center pt-4 md:w-1/2">
            <h2>Number of liked cats per breed</h2>
            <ResponsiveContainer width="100%" height={1000}>
              <BarChart
                data={analytics.catBreedDistribution}
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
        <h3 className="text-center md:text-left">Top Recommended Cats</h3>
        <div className={`grid grid-cols-1 gap-4 md:grid-cols-3`}>
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
        <h3 className="text-center md:text-left">Bottom Cat Picks</h3>
        <div className={`grid grid-cols-1 gap-4 md:grid-cols-3`}>
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
type DistributionType = Record<string, { breed: string; count: number }>;

function calculateCatAnalytics(catJudgements: CatJudgements): Analytics {
  // Cat breed distribution
  const catBreedDistributionMap: DistributionType = {};
  for (const catUrl in catJudgements) {
    const breed = extractCatBreedFromUrl(catUrl);
    if (breed in catBreedDistributionMap) {
      catBreedDistributionMap[breed].count++;
    } else {
      catBreedDistributionMap[breed] = { breed: breed, count: 1 };
    }
  }
  const sortedDistribution = Object.values(catBreedDistributionMap).sort(
    (a, b) => b.count - a.count,
  );

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
    most: { breed: string; count: number };
    least: { breed: string; count: number };
  };
  const initialMostLeastPair: MostLeastPair = {
    most: { breed: "", count: 0 },
    least: { breed: "", count: Number.MAX_SAFE_INTEGER },
  };
  const { most: mostLikedCatBreed, least: leastLikedCatBreed } = Object.entries(
    catBreedDistributionMap,
  ).reduce((mostLeastPair: MostLeastPair, [breed, obj]) => {
    const most = mostLeastPair.most;
    const least = mostLeastPair.least;
    if (obj.count > most.count) {
      most.breed = breed;
      most.count = obj.count;
    }
    if (obj.count < least.count) {
      least.breed = breed;
      least.count = obj.count;
    }
    return { most, least };
  }, initialMostLeastPair);

  return {
    catBreedDistribution: sortedDistribution,
    numberOfCatJudgements,
    numberOfLikedCats,
    numberOfDislikedCats,
    likeDislikeRatio,
    mostLikedCatBreed,
    leastLikedCatBreed,
  };
}
