import GridCarousel from './components/ui/organisms/Carousel/GridCarousel';
import SingleItemCarousel from './components/ui/organisms/Carousel/SingleItemCarousel';

function App() {
  return (
    <main>
      <section style={{ padding: '0 24px', margin: '30px 0 30px 0' }}>
        <GridCarousel />
      </section>
      <section style={{ padding: '0 24px' }}>
        <SingleItemCarousel />
      </section>
    </main>
  );
}

export default App;
