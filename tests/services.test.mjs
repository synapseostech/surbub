import test from 'node:test';
import assert from 'node:assert/strict';

test('Mobility Fare Calculation Formula', () => {
  const baseFareUGX = 500;
  const ratePerKmUGX = 450;
  
  // Test a 1.8km trip (KIU to Roundabout)
  const distanceKm = 1.8;
  const distanceFare = Math.round(distanceKm * ratePerKmUGX);
  const totalFare = baseFareUGX + distanceFare;

  assert.equal(distanceFare, 810);
  assert.equal(totalFare, 1310);
});

test('Special Hire Fare Calculation Formula', () => {
  const baseFareUGX = 5000;
  const ratePerKmUGX = 2000;
  
  // Test a 8.4km trip (Ishaka to Bushenyi Town)
  const distanceKm = 8.4;
  const distanceFare = Math.round(distanceKm * ratePerKmUGX);
  const totalFare = baseFareUGX + distanceFare;

  assert.equal(distanceFare, 16800);
  assert.equal(totalFare, 21800);
});

test('Cart Total Calculation Logic', () => {
  const items = [
    { priceUGX: 22000, quantity: 1, itemTotalUGX: 22000 },
    { priceUGX: 5000, quantity: 2, itemTotalUGX: 10000 },
  ];

  const subtotal = items.reduce((sum, it) => sum + it.itemTotalUGX, 0);
  const deliveryFee = 2000;
  const serviceFee = 500;
  const total = subtotal + deliveryFee + serviceFee;

  assert.equal(subtotal, 32000);
  assert.equal(total, 34500);
});
