import '../../../stub_loader';
import {test} from '../../../util/test';
import browser from '../../../../rollup/build/tsc/src/util/browser';
import Map from '../../../../rollup/build/tsc/src/ui/map';
import DOM from '../../../../rollup/build/tsc/src/util/dom';
import simulate from '../../../util/simulate_interaction';

function createMap() {
    return new Map({container: DOM.create('div', '', window.document.body)});
}

test('Map#isZooming returns false by default', (t) => {
    const map = createMap(t);
    t.equal(map.isZooming(), false);
    map.remove();
    t.end();
});

test('Map#isZooming returns true during a camera zoom animation', (t) => {
    const map = createMap(t);

    map.on('zoomstart', () => {
        t.equal(map.isZooming(), true);
    });

    map.on('zoomend', () => {
        t.equal(map.isZooming(), false);
        map.remove();
        t.end();
    });

    map.zoomTo(5, {duration: 0});
});

test('Map#isZooming returns true when scroll zooming', (t) => {
    const map = createMap(t);

    map.on('zoomstart', () => {
        t.equal(map.isZooming(), true);
    });

    map.on('zoomend', () => {
        t.equal(map.isZooming(), false);
        map.remove();
        t.end();
    });

    let now = 0;
    t.stub(browser, 'now').callsFake(() => now);

    simulate.wheel(map.getCanvas(), {type: 'wheel', deltaY: -simulate.magicWheelZoomDelta});
    map._renderTaskQueue.run();

    now += 400;
    setTimeout(() => {
        map._renderTaskQueue.run();
    }, 400);
});

test('Map#isZooming returns true when double-click zooming', (t) => {
    const map = createMap(t);

    map.on('zoomstart', () => {
        t.equal(map.isZooming(), true);
    });

    map.on('zoomend', () => {
        t.equal(map.isZooming(), false);
        map.remove();
        t.end();
    });

    let now = 0;
    t.stub(browser, 'now').callsFake(() => now);

    simulate.dblclick(map.getCanvas());
    map._renderTaskQueue.run();

    now += 500;
    map._renderTaskQueue.run();
});
