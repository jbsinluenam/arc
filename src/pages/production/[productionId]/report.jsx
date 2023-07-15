// react and redux
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setProductionReport } from "~/redux/features/ProductionReportSlice";

// services
import createDailyProductionReport from "~/service/production/createDailyProductionReport";
import getTodayReportId from "~/service/production/getTodayReportId";
import {
  getProductionInfoById,
  getProductionReportById,
} from "~/service/production";

// components
import Head from "next/head";
import MainPageLayout from "~/components/layouts/MainPageLayout";
import Sidebar from "~/components/production/Information";
import ScheduleOfTheDayForm from "~/components/report/ScheduleOfTheDayForm";
import ActualScheduleForm from "~/components/report/ActualScheduleForm";
import AccordionCrud from "~/components/report/AccordionCrud";
import RollsForm from "~/components/report/RollsForm";
import CastTimeLogForm from "~/components/report/CastTimeLogForm";
import ScenesShotForm from "~/components/report/ScenesShotForm.jsx";

const ProductionReportPage = ({ productionInfo, report }) => {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    //Puting the report data in redux store
    dispatch(setProductionReport(report));
    // console.log(report);
  }, []);

  const pageContainerClasses = isExpanded
    ? ""
    : "ml-[-334px] w-[calc(100vw+334px)]";

  return (
    <MainPageLayout>
      <Head>
        <title>{productionInfo.title} | Arc </title>
      </Head>

      <div
        className={` flex flex-1 bg-backgroundArc pt-8 transition-all ${pageContainerClasses}`}
      >
        <aside className="relative  flex flex-shrink-0 flex-col bg-arc md:basis-[384px]">
          <Sidebar data={productionInfo} isContentVisible={!isExpanded} />

          <button
            className="absolute right-[-.75rem] top-[8px] h-[28px] w-[28px] rounded-full bg-arc text-primary-dark shadow-3xl"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? `<` : `>`}
            <span className="sr-only">
              {isExpanded
                ? `Minimize Production Info Sidebar`
                : `Expand Production Info Sidebar`}
            </span>
          </button>
        </aside>

        <div className="grid flex-1 grid-cols-2 content-start gap-4 px-8 pb-8">
          <div className="col-span-full">
            <ScheduleOfTheDayForm />
          </div>

          <ActualScheduleForm />

          <RollsForm />

          <div className="col-span-full">
            <AccordionCrud title={"Cast Time Log Schedule"} defaultOpen={true}>
              <CastTimeLogForm productionInfo={productionInfo} />
            </AccordionCrud>
          </div>

          <div className="col-span-full">
            <AccordionCrud title={"Scenes Shot Form"} defaultOpen={true}>
              <ScenesShotForm productionInfo={productionInfo} />
            </AccordionCrud>
          </div>
        </div>
      </div>
    </MainPageLayout>
  );
};

export const getServerSideProps = async (ctx) => {
  try {
    const productionInfo = await getProductionInfoById(ctx.query.productionId);

    const { todayReportId } = await getTodayReportId(ctx.query.productionId);

    let result = null;

    if (!todayReportId) {
      const response = await createDailyProductionReport(
        ctx.query.productionId
      );

      result = response.report;
    } else {
      result = await getProductionReportById(
        ctx.query.productionId,
        todayReportId
      );
    }

    return {
      props: {
        report: result,
        productionInfo,
      },
    };
  } catch (error) {
    //Redirect if the productionId is not valid
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }
};

export default ProductionReportPage;