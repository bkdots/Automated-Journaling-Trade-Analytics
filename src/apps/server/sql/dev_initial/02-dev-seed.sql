-- root user (at id = 0)
INSERT INTO "user" 
    (id,  typ, username, cid, ctime, mid, mtime) VALUES 
    (0, 'Sys', 'root',  0,   now(), 0,   now());

-- User demo1
INSERT INTO "user" 
    (id, username, cid, ctime, mid, mtime) VALUES
    (1, 'demo1',  0,   now(), 0,   now()),
    (2, 'demo2',  0,   now(), 0,   now());

-- Agent mock-01 (with 'parrot' model) (id: 100)
INSERT INTO "agent"    
    (id,  owner_id, name,      cid, ctime, mid, mtime) VALUES
    (100, 0,        'mock-01', 0,   now(), 0,   now());

-- Sample data for the tag table
INSERT INTO tag (
    id, user_id, tag_name, tag_type, description, cid, ctime, mid, mtime
) VALUES
      (0, 0, 'Strong Entry Signal', 'Entry', 'Tag for trades with a strong entry signal', 1, '2024-05-01 09:30:00+00', 1, '2024-05-01 09:30:00+00'),
      (1, 0, 'Profit Exit', 'Exit', 'Tag for trades exited at a profit', 2, '2024-05-02 09:30:00+00', 2, '2024-05-02 09:30:00+00'),
      (2, 0, 'Poor Management', 'Management', 'Tag for trades with poor management', 3, '2024-05-03 09:30:00+00', 3, '2024-05-03 09:30:00+00'),
      (3, 0, 'Entry Mistake', 'Mistake', 'Tag for trades with an entry mistake', 4, '2024-05-04 09:30:00+00', 4, '2024-05-04 09:30:00+00'),
      (4, 0, 'Exit Mistake', 'Mistake', 'Tag for trades with an exit mistake', 5, '2024-05-05 09:30:00+00', 5, '2024-05-05 09:30:00+00');

INSERT INTO tag (
    id, user_id, tag_name, tag_type, description, cid, ctime, mid, mtime
) VALUES
      (5, 1, 'Strong Entry Signal', 'Entry', 'Tag for trades with a strong entry signal', 1, '2024-05-01 09:30:00+00', 1, '2024-05-01 09:30:00+00'),
      (6, 1, 'Profit Exit', 'Exit', 'Tag for trades exited at a profit', 2, '2024-05-02 09:30:00+00', 2, '2024-05-02 09:30:00+00'),
      (7, 1, 'Poor Management', 'Management', 'Tag for trades with poor management', 3, '2024-05-03 09:30:00+00', 3, '2024-05-03 09:30:00+00'),
      (8, 1, 'Entry Mistake', 'Mistake', 'Tag for trades with an entry mistake', 4, '2024-05-04 09:30:00+00', 4, '2024-05-04 09:30:00+00'),
      (9, 1, 'Exit Mistake', 'Mistake', 'Tag for trades with an exit mistake', 5, '2024-05-05 09:30:00+00', 5, '2024-05-05 09:30:00+00');


-- Sample data for the journal table
INSERT INTO journal (
    id, user_id, title, description, cid, ctime, mid, mtime
) VALUES
      (0, 0, 'Tech Stock Journal', 'Journal for tracking trades in technology stocks', 1, '2024-05-01 09:00:00+00', 1, '2024-05-01 09:00:00+00'),
      (1, 0, 'Options Trading Journal', 'Journal for tracking options trades', 2, '2024-05-02 09:00:00+00', 2, '2024-05-02 09:00:00+00'),
      (2, 0, 'Futures Trading Journal', 'Journal for tracking futures trades', 3, '2024-05-03 09:00:00+00', 3, '2024-05-03 09:00:00+00'),
      (3, 0, 'Dividend Stock Journal', 'Journal for tracking trades in dividend stocks', 4, '2024-05-04 09:00:00+00', 4, '2024-05-04 09:00:00+00'),
      (4, 0, 'Forex Trading Journal', 'Journal for tracking forex trades', 5, '2024-05-05 09:00:00+00', 5, '2024-05-05 09:00:00+00');
INSERT INTO journal (
    id, user_id, title, description, cid, ctime, mid, mtime
) VALUES
      (5, 1, 'Tech Stock Journal', 'Journal for tracking trades in technology stocks', 1, '2024-05-01 09:00:00+00', 1, '2024-05-01 09:00:00+00'),
      (6, 1, 'Options Trading Journal', 'Journal for tracking options trades', 2, '2024-05-02 09:00:00+00', 2, '2024-05-02 09:00:00+00'),
      (7, 1, 'Futures Trading Journal', 'Journal for tracking futures trades', 3, '2024-05-03 09:00:00+00', 3, '2024-05-03 09:00:00+00'),
      (8, 1, 'Dividend Stock Journal', 'Journal for tracking trades in dividend stocks', 4, '2024-05-04 09:00:00+00', 4, '2024-05-04 09:00:00+00'),
      (9, 1, 'Forex Trading Journal', 'Journal for tracking forex trades', 5, '2024-05-05 09:00:00+00', 5, '2024-05-05 09:00:00+00');

-- Sample data for the trade table
INSERT INTO trade (
    id, user_id, journal_id, trade_type, instrument, entry_time, exit_time, direction,
    option_type, multiplier, entry_price, quantity, target_stop_loss, target_take_profit,
    exit_price, fees, notes, highest_price, lowest_price, origin_take_profit_hit, confidence,
    entry_rating, exit_rating, execution_rating, management_rating, net_profit_loss,
    gross_profit_loss, pnl_percentage, time_in_trade, cid, ctime, mid, mtime
) VALUES
-- Spot trades
(0, 0, 1, 'Spot', 'AAPL', '2024-05-01 10:00:00+00', '2024-05-01 14:00:00+00', 'Buy',
 NULL, NULL, 145.50, 10, 140.00, 150.00, 148.00, 2.50, 'Spot trade example', 150.00, 145.00, TRUE,
 80, 4, 4, 4, 4, 25.00, 30.00, 5.00, '2024-05-01 04:00:00+00', 1, '2024-05-01 10:00:00+00', 1, '2024-05-01 14:00:00+00'),
-- Option trades
(1, 0, 2, 'Option', 'TSLA', '2024-05-02 09:30:00+00', '2024-05-02 11:00:00+00', 'Sell',
 'Call', 100, 700.00, 5, 650.00, 750.00, 710.00, 3.00, 'Option trade example', 715.00, 690.00, FALSE,
 90, 5, 4, 5, 5, -50.00, 35.00, -7.14, '2024-05-02 01:30:00+00', 2, '2024-05-02 09:30:00+00', 2, '2024-05-02 11:00:00+00'),
-- Future trades
(2, 0, 3, 'Future', 'ES', '2024-05-03 13:00:00+00', '2024-05-03 16:00:00+00', 'Buy',
 NULL, 50, 4200.00, 2, 4150.00, 4300.00, 4250.00, 4.00, 'Future trade example', 4260.00, 4200.00, TRUE,
 85, 4, 3, 4, 4, 100.00, 120.00, 2.38, '2024-05-03 03:00:00+00', 3, '2024-05-03 13:00:00+00', 3, '2024-05-03 16:00:00+00'),
-- Another spot trade
(3, 0, 4, 'Spot', 'GOOGL', '2024-05-04 12:00:00+00', NULL, 'Sell',
 NULL, NULL, 2400.00, 3, 2350.00, 2450.00, NULL, 1.50, 'Spot trade without exit', 2450.00, 2380.00, FALSE,
 70, 3, 3, 3, 3, NULL, NULL, NULL, NULL, 4, '2024-05-04 12:00:00+00', 4, '2024-05-04 12:00:00+00'),
-- Another option trade
(4, 0, 0, 'Option', 'MSFT', '2024-05-05 14:30:00+00', '2024-05-05 15:30:00+00', 'Buy',
 'Put', 100, 250.00, 8, 245.00, 255.00, 252.00, 2.00, 'Option trade example', 253.00, 248.00, FALSE,
 75, 4, 4, 4, 4, 16.00, 24.00, 3.2, '2024-05-05 01:00:00+00', 5, '2024-05-05 14:30:00+00', 5, '2024-05-05 15:30:00+00');
INSERT INTO trade (
    id, user_id, journal_id, trade_type, instrument, entry_time, exit_time, direction,
    option_type, multiplier, entry_price, quantity, target_stop_loss, target_take_profit,
    exit_price, fees, notes, highest_price, lowest_price, origin_take_profit_hit, confidence,
    entry_rating, exit_rating, execution_rating, management_rating, net_profit_loss,
    gross_profit_loss, pnl_percentage, time_in_trade, cid, ctime, mid, mtime
) VALUES
-- Spot trades
(5, 1, 1, 'Spot', 'AAPL', '2024-05-01 10:00:00+00', '2024-05-01 14:00:00+00', 'Buy',
 NULL, NULL, 145.50, 10, 140.00, 150.00, 148.00, 2.50, 'Spot trade example', 150.00, 145.00, TRUE,
 80, 4, 4, 4, 4, 25.00, 30.00, 5.00, '2024-05-01 04:00:00+00', 1, '2024-05-01 10:00:00+00', 1, '2024-05-01 14:00:00+00'),
-- Option trades
(6, 1, 2, 'Option', 'TSLA', '2024-05-02 09:30:00+00', '2024-05-02 11:00:00+00', 'Sell',
 'Call', 100, 700.00, 5, 650.00, 750.00, 710.00, 3.00, 'Option trade example', 715.00, 690.00, FALSE,
 90, 5, 4, 5, 5, -50.00, 35.00, -7.14, '2024-05-02 01:30:00+00', 2, '2024-05-02 09:30:00+00', 2, '2024-05-02 11:00:00+00'),
-- Future trades
(7, 1, 3, 'Future', 'ES', '2024-05-03 13:00:00+00', '2024-05-03 16:00:00+00', 'Buy',
 NULL, 50, 4200.00, 2, 4150.00, 4300.00, 4250.00, 4.00, 'Future trade example', 4260.00, 4200.00, TRUE,
 85, 4, 3, 4, 4, 100.00, 120.00, 2.38, '2024-05-03 03:00:00+00', 3, '2024-05-03 13:00:00+00', 3, '2024-05-03 16:00:00+00'),
-- Another spot trade
(8, 1, 4, 'Spot', 'GOOGL', '2024-05-04 12:00:00+00', NULL, 'Sell',
 NULL, NULL, 2400.00, 3, 2350.00, 2450.00, NULL, 1.50, 'Spot trade without exit', 2450.00, 2380.00, FALSE,
 70, 3, 3, 3, 3, NULL, NULL, NULL, NULL, 4, '2024-05-04 12:00:00+00', 4, '2024-05-04 12:00:00+00'),
-- Another option trade
(9, 1, 0, 'Option', 'MSFT', '2024-05-05 14:30:00+00', '2024-05-05 15:30:00+00', 'Buy',
 'Put', 100, 250.00, 8, 245.00, 255.00, 252.00, 2.00, 'Option trade example', 253.00, 248.00, FALSE,
 75, 4, 4, 4, 4, 16.00, 24.00, 3.2, '2024-05-05 01:00:00+00', 5, '2024-05-05 14:30:00+00', 5, '2024-05-05 15:30:00+00');

-- Sample data for the trade_tag table
INSERT INTO trade_tag (
    trade_id, tag_id, user_id, cid, ctime, mid, mtime
) VALUES
      (1, 0, 1, 1, '2024-05-01 09:30:00+00', 1, '2024-05-01 09:30:00+00'),
      (1, 2, 1, 1, '2024-05-02 09:30:00+00', 1, '2024-05-02 09:30:00+00');

-- Insert fake data into exchange table
INSERT INTO exchange (
    id, exchange_name, image_id, exchange_referral, instruction, cid, ctime, mid, mtime
) VALUES
      ('0', 'Binance', 'img-binance', 'https://www.binance.com/?ref=123456', 'Follow these steps to set up your Binance account.', 1, '2024-05-01 10:00:00+00', 1, '2024-05-01 10:00:00+00'),
      ('1', 'Coinbase', 'img-coinbase', 'https://www.coinbase.com/join/123456', 'Follow these steps to set up your Coinbase account.', 2, '2024-05-02 11:00:00+00', 2, '2024-05-02 11:00:00+00'),
      ('2', 'Kraken', 'img-kraken', 'https://www.kraken.com/sign-up?ref=123456', 'Follow these steps to set up your Kraken account.', 3, '2024-05-03 12:00:00+00', 3, '2024-05-03 12:00:00+00'),
      ('3', 'Bitfinex', 'img-bitfinex', 'https://www.bitfinex.com/sign-up?ref=123456', 'Follow these steps to set up your Bitfinex account.', 4, '2024-05-04 13:00:00+00', 4, '2024-05-04 13:00:00+00'),
      ('4', 'Gemini', 'img-gemini', 'https://www.gemini.com/?ref=123456', 'Follow these steps to set up your Gemini account.', 5, '2024-05-05 14:00:00+00', 5, '2024-05-05 14:00:00+00');

-- Create API keys for demo1 and demo2 user
-- Binance API Key
INSERT INTO api_key (
    id, user_id, exchange_id, title, api_key_value, api_key_secret, api_referral, cid, ctime, mid, mtime
) VALUES
      (0, 1, 0, 'Binance API Key', 'your_binance_api_key_value', 'your_binance_api_key_secret', false, 1, '2024-05-01 10:00:00+00', 1, '2024-05-01 10:00:00+00'),
      (1, 1, 1, 'Coinbase API Key', 'your_coinbase_api_key_value', 'your_coinbase_api_key_secret', false, 1, '2024-05-02 11:00:00+00', 1, '2024-05-02 11:00:00+00'),
      (2, 1, 2, 'Kraken API Key', 'your_kraken_api_key_value', 'your_kraken_api_key_secret', false, 1, '2024-05-03 12:00:00+00', 1, '2024-05-03 12:00:00+00'),
      (4, 1, 3, 'Bitfinex API Key', 'your_bitfinex_api_key_value', 'your_bitfinex_api_key_secret', false, 1, '2024-05-04 13:00:00+00', 1, '2024-05-04 13:00:00+00'),
      (5, 2, 0, 'Binance API Key', 'your_binance_api_key_value', 'your_binance_api_key_secret', false, 1, '2024-05-01 10:00:00+00', 1, '2024-05-01 10:00:00+00'),
      (6, 2, 3, 'Bitfinex API Key', 'your_bitfinex_api_key_value', 'your_bitfinex_api_key_secret', false, 1, '2024-05-04 13:00:00+00', 1, '2024-05-04 13:00:00+00');
