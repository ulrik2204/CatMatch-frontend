import { type ReactElement, useCallback } from "react";
import Button from "../components/Button";
import CatCard from "../components/CatCard";
import Swipeable from "../components/Swipeable";
import { useCatJudgements, useSuggestedCatWithPreload } from "../helpers/hooks";
import { CatJudgement } from "../types/catJudgement";

export default function IndexPage(): ReactElement {
  const { catJudgements, judgeCat } = useCatJudgements();
  const { suggestedCatId: currentCatId, nextCat } = useSuggestedCatWithPreload(catJudgements);

  const handleLike = useCallback(() => {
    if (!currentCatId) return;
    judgeCat(currentCatId, CatJudgement.LIKE);
    nextCat();
  }, [nextCat, judgeCat, currentCatId]);

  const handleDislike = useCallback(() => {
    if (!currentCatId) return;
    judgeCat(currentCatId, CatJudgement.DISLIKE);
    nextCat();
  }, [nextCat, judgeCat, currentCatId]);

  return (
    <div className="flex flex-col items-center gap-5 p-2 pt-16">
      <div className="flex w-full flex-col items-center lg:w-1/3">
        {currentCatId === undefined && <div>Loading</div>}
        {currentCatId && (
          <Swipeable onLike={handleLike} onDislike={handleDislike}>
            <CatCard catId={currentCatId} />
          </Swipeable>
        )}
        {currentCatId === null && <div>Out of cats!</div>}
      </div>
      <div className="flex w-64 flex-row justify-between">
        <Button onClick={handleDislike} color="secondary">
          Dislike
        </Button>
        <Button onClick={handleLike}>Like</Button>
      </div>
    </div>
  );
}
