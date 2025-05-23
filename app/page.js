import Image from "next/image";
import Metrics from "@/components/Metrics";
import MetricForm from "@/components/MetricForm";
import MetricsChart from "@/components/MetricChart";

export default function Home() {
  return (
    <div>
      {/* Display Chart component here*/}
      <MetricsChart />
    </div>
  );
}
