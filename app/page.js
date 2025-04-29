import Image from "next/image";
import Metrics from "@/components/Metrics";
import MetricForm from "@/components/MetricForm";

export default function Home() {
  return (
    <div>
      <Metrics />
      <hr />
      <MetricForm/>
    </div>
  );
}
