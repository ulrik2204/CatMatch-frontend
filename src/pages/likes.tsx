import Button from "../components/Button";
import { useCatJudgements } from "../helpers/hooks";
import { extractCatNameFromUrl } from "../helpers/utils";
import { CatJudgement } from "../types/catJudgement";

export default function LikesPage() {
  const { catJudgements, judgeCat } = useCatJudgements();
  const likedCatIds = Object.entries(catJudgements)
    .filter(([_id, judgement]) => judgement === CatJudgement.LIKE)
    .map(([id]) => id);

  return (
    <div className="flex w-full flex-col items-center pt-8">
      <h1>Liked Cats</h1>
      <div className="flex w-full flex-col items-center pt-6">
        {likedCatIds.map((catUrl) => (
          <div
            key={catUrl}
            className="flex w-5/6 items-center justify-between pt-4 md:w-3/5 lg:w-2/5
          "
          >
            <div>{extractCatNameFromUrl(catUrl)}</div>
            <div className="flex w-40 justify-between md:w-48">
              <a href={`/single/${btoa(catUrl)}`}>
                <Button>See cat</Button>
              </a>
              <Button color="secondary" onClick={() => judgeCat(catUrl, CatJudgement.DISLIKE)}>
                Dislike
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
