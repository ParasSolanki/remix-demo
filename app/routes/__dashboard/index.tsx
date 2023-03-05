import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => ({
  title: "Home",
});

export default function IndexPage() {
  return (
    <section>
      <h2 className="text-3xl font-bold text-white">Vist sidebar links</h2>
    </section>
  );
}
