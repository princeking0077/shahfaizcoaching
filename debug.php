<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Hostinger Debugger & System Check</h1>";

echo "<h2>1. Server Environment</h2>";
echo "<strong>PHP Version:</strong> " . phpversion() . "<br>";
echo "<strong>Server Software:</strong> " . $_SERVER['SERVER_SOFTWARE'] . "<br>";
echo "<strong>Current Directory:</strong> " . getcwd() . "<br>";
echo "<strong>User:</strong> " . get_current_user() . "<br>";

echo "<h2>2. Node.js Environment (shell_exec)</h2>";
// Try to find node/npm paths
$nodePath = shell_exec('which node');
$npmPath = shell_exec('which npm');

echo "<strong>Node Path:</strong> " . ($nodePath ? $nodePath : "Not in PATH") . "<br>";
echo "<strong>Node Version:</strong> " . shell_exec('node -v 2>&1') . "<br>";
echo "<strong>NPM Version:</strong> " . shell_exec('npm -v 2>&1') . "<br>";

echo "<h2>3. File System Check (Current Dir)</h2>";
$files = scandir(getcwd());
echo "<pre>Files found:\n";
print_r($files);
echo "</pre>";

echo "<h2>4. Permissions Check</h2>";
$testFile = 'write_test_123.txt';
if (@file_put_contents($testFile, 'test content')) {
    echo "<span style='color:green'>[PASS] Write permission OK.</span><br>";
    unlink($testFile);
} else {
    echo "<span style='color:red'>[FAIL] Cannot write to this directory.</span><br>";
}

echo "<h2>5. Environment Variables (limited)</h2>";
if (isset($_ENV['DB_HOST'])) { echo "DB_HOST is set.<br>"; } else { echo "DB_HOST is NOT visible to PHP (Expected if set in Node manager).<br>"; }

?>
