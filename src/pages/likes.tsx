import Button from "../components/Button";
import { useCatJudgements } from "../helpers/hooks";
import { extractCatNameFromUrl } from "../helpers/utils";
import { CatJudgement } from "../types/catJudgement";

export default function LikesPage() {
  const { catJudgements, judgeCat, clearCatJudgements } = useCatJudgements();
  const likedCatIds = Object.entries(catJudgements)
    .filter(([_id, judgement]) => judgement === CatJudgement.LIKE)
    .map(([id]) => id);

  return (
    <div className="flex w-full flex-col items-center pt-8">
      <h1 className="pb-8">Liked Cats</h1>
      <Button color="secondary" onClick={clearCatJudgements}>
        Clear Swipes
      </Button>

      <div className="grid w-11/12 grid-cols-2 items-center gap-4 pt-12 md:w-1/2">
        {likedCatIds.map((catUrl) => (
          <>
            <div>{extractCatNameFromUrl(catUrl)}</div>
            <div className="flex w-40 justify-between justify-self-end">
              <a href={`/single/${btoa(catUrl)}`}>
                <Button>See cat</Button>
              </a>
              <Button color="secondary" onClick={() => judgeCat(catUrl, CatJudgement.DISLIKE)}>
                Dislike
              </Button>
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
