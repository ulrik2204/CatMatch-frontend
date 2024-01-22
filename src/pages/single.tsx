import { useParams } from "react-router-dom";
import CatCard from "../components/CatCard";

export default function SingleCatCardPage() {
  const params = useParams();
  if (!params.catId) {
    return <div>No cat ID specified</div>;
  }
  const catId = atob(params.catId);

  return (
    <div className="flex flex-col items-center pt-16">{catId && <CatCard catId={catId} />}</div>
  );
}
